import "dotenv/config";
import PocketBase from "pocketbase";

const {
  LOCAL_PB_URL,
  LOCAL_ADMIN_EMAIL,
  LOCAL_ADMIN_PASSWORD,
  REMOTE_PB_URL,
  REMOTE_ADMIN_EMAIL,
  REMOTE_ADMIN_PASSWORD,
} = process.env;

if (!LOCAL_PB_URL || !LOCAL_ADMIN_EMAIL || !LOCAL_ADMIN_PASSWORD || !REMOTE_PB_URL || !REMOTE_ADMIN_EMAIL || !REMOTE_ADMIN_PASSWORD) {
  console.error("Veuillez définir toutes les variables dans .env.migration");
  process.exit(1);
}

const collectionsToMigrate = [
  { name: "boutiques", fileFields: ["image", "logo"] },
  { name: "restaurants", fileFields: ["image", "logo"] },
  { name: "loisirs", fileFields: ["image", "logo"] },
  { name: "evenements", fileFields: ["image"] },
];

const textIdFieldCandidates = ["nom", "name", "titre", "title", "slug"];

async function downloadFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${url}: ${res.status}`);
  const buf = await res.arrayBuffer();
  const fileName = url.split("/").pop().split("?")[0];
  return { buffer: Buffer.from(buf), fileName, type: res.headers.get("content-type") || "application/octet-stream" };
}

function pickScalarFields(record, fileFields) {
  const output = {};
  for (const [key, value] of Object.entries(record)) {
    if (key.startsWith("@") || key === "id" || key === "collectionId" || key === "collectionName" || key === "expand" || key === "created" || key === "updated") continue;
    if (fileFields.includes(key)) continue;
    output[key] = value;
  }
  return output;
}

async function main() {
  const pbLocal = new PocketBase(LOCAL_PB_URL);
  const pbRemote = new PocketBase(REMOTE_PB_URL);

  // Utiliser l authentification normale au lieu de admins
  await pbLocal.collection("users").authWithPassword(LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD);
  await pbRemote.collection("users").authWithPassword(REMOTE_ADMIN_EMAIL, REMOTE_ADMIN_PASSWORD);

  const nameToIdMap = { boutiques: new Map(), restaurants: new Map(), loisirs: new Map() };

  // 1) Migrer les 3 collections de base (sans relations)
  for (const { name, fileFields } of collectionsToMigrate.filter(c => c.name !== "evenements")) {
    console.log(`\nMigrating collection: ${name}`);
    const items = await pbLocal.collection(name).getFullList({ batch: 200, sort: "-created" });
    for (const item of items) {
      const formData = new FormData();
      const scalars = pickScalarFields(item, fileFields);
      for (const [k, v] of Object.entries(scalars)) formData.append(k, Array.isArray(v) ? JSON.stringify(v) : v ?? "");

      // fichiers
      for (const f of fileFields) {
        const value = item[f];
        if (!value) continue;
        const fileName = Array.isArray(value) ? value[0] : value;
        if (!fileName) continue;
        const fileUrl = pbLocal.files.getUrl(item, fileName);
        const { buffer, fileName: outName, type } = await downloadFile(fileUrl);
        formData.append(f, new Blob([buffer], { type }), outName);
      }

      const created = await pbRemote.collection(name).create(formData);

      // créer mapping par un champ texte stable
      const textIdField = textIdFieldCandidates.find(k => created[k]);
      if (textIdField) {
        nameToIdMap[name].set(created[textIdField], created.id);
      }
      console.log(`  created ${name}  ${created.id}`);
    }
  }

  // 2) Migrer evenements en 2 passes (sans puis avec relations)
  console.log("\nMigrating collection: evenements");
  const events = await pbLocal.collection("evenements").getFullList({ batch: 200, sort: "-created" });

  const remoteEventIds = [];
  for (const item of events) {
    const formData = new FormData();
    const scalars = pickScalarFields(item, ["image", "boutiques", "restaurants", "loisirs"]);
    for (const [k, v] of Object.entries(scalars)) formData.append(k, Array.isArray(v) ? JSON.stringify(v) : v ?? "");

    if (item.image) {
      const url = pbLocal.files.getUrl(item, item.image);
      const { buffer, fileName, type } = await downloadFile(url);
      formData.append("image", new Blob([buffer], { type }), fileName);
    }

    const created = await pbRemote.collection("evenements").create(formData);
    remoteEventIds.push({ local: item, remoteId: created.id });
    console.log(`  created evenements  ${created.id}`);
  }

  // 3) Mettre à jour les relations des evenements par correspondance sur "nom" ou "titre"
  console.log("\nUpdating event relations");
  for (const e of remoteEventIds) {
    const rel = { boutiques: [], restaurants: [], loisirs: [] };

    const local = e.local;
    const titleKey = textIdFieldCandidates.find(k => local[k]);

    const addByName = (arr, map, localCollectionName) => {
      if (!Array.isArray(arr)) return [];
      const names = [];
      for (const idOrName of arr) {
        // On ne connaît pas les anciens IDs, on suppose que "nom" est unique et on l a migré tel quel
        const localItem = typeof idOrName === "string" ? idOrName : String(idOrName);
        names.push(localItem);
      }
      const ids = [];
      for (const n of names) {
        const id = map.get(n);
        if (id) ids.push(id);
      }
      if (ids.length !== names.length) {
        console.warn(`  [warn] ${titleKey ? local[titleKey] : e.remoteId}: unable to resolve some ${localCollectionName} relations`);
      }
      return ids;
    };

    const boutiquesIds = addByName(local.boutiques || [], nameToIdMap.boutiques, "boutiques");
    const restaurantsIds = addByName(local.restaurants || [], nameToIdMap.restaurants, "restaurants");
    const loisirsIds = addByName(local.loisirs || [], nameToIdMap.loisirs, "loisirs");

    await pbRemote.collection("evenements").update(e.remoteId, {
      boutiques: boutiquesIds,
      restaurants: restaurantsIds,
      loisirs: loisirsIds,
    });
  }

  console.log("\nMigration terminée.");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
