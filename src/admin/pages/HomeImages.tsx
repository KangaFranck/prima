import React, { useEffect, useState, useRef } from 'react';
import { Save, Upload, ShoppingBag, Coffee, Utensils, Wrench, Image as ImageIcon } from 'lucide-react';
import { useHomeSettingsStore } from '../../store/homeSettingsStore';
import { apiClient } from '../../services/apiClient';

const BLOCKS = [
  { key: 'image_boutiques' as const, label: 'Boutiques', icon: ShoppingBag },
  { key: 'image_restaurants' as const, label: 'Restaurants', icon: Coffee },
  { key: 'image_loisirs' as const, label: 'Loisirs', icon: Utensils },
  { key: 'image_services' as const, label: 'Services', icon: Wrench },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = (r.result as string)?.split(',')[1] || (r.result as string);
      resolve(s || '');
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

export const HomeImages = () => {
  const { settings, loading, error, fetchSettings, updateSettings } = useHomeSettingsStore();
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const p: Record<string, string> = {};
    BLOCKS.forEach(({ key }) => {
      const url = settings[key];
      if (url) p[key] = url.startsWith('http') ? url : url.startsWith('/') ? url : `/${url}`.replace(/\/+/g, '/');
    });
    setPreviews(p);
  }, [settings]);

  const handleFileSelect = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setPendingFiles((prev) => ({ ...prev, [key]: file }));
    fileToBase64(file).then((base64) => {
      const dataUrl = `data:${file.type};base64,${base64}`;
      setPreviews((prev) => ({ ...prev, [key]: dataUrl }));
    });
    e.target.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const updates: Record<string, string> = {};
      for (const { key } of BLOCKS) {
        const file = pendingFiles[key];
        if (file) {
          const base64 = await fileToBase64(file);
          const { url } = await apiClient.upload.upload(base64, 'home', file.name, file.type);
          updates[key] = url;
        }
      }
      if (Object.keys(updates).length > 0) {
        await updateSettings(updates);
        setPendingFiles({});
      }
      setMessage({ type: 'success', text: 'Images enregistrées avec succès.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Erreur lors de la sauvegarde.' });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(pendingFiles).length > 0;

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl font-bold text-[#2C2C2C]">Images de la page d'accueil</h1>
          <p className="text-gray-600 mt-1">
            Remplacez les 4 images de la section « Nos Univers » (Boutiques, Restaurants, Loisirs, Services).
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BLOCKS.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-[#2C2C2C]" />
                  <span className="font-medium text-[#2C2C2C]">{label}</span>
                </div>
              </div>
              <div className="p-4">
                <input
                  ref={(el) => { fileInputRefs.current[key] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(key, e)}
                  aria-label={`Choisir une image pour ${label}`}
                />
                <div
                  onClick={() => fileInputRefs.current[key]?.click()}
                  className="aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 transition-colors overflow-hidden"
                >
                  {previews[key] ? (
                    <img
                      src={previews[key]}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                      <span className="text-sm">Cliquez pour choisir une image</span>
                    </div>
                  )}
                </div>
                {pendingFiles[key] && (
                  <p className="mt-2 text-sm text-amber-600">
                    Nouvelle image prête à être enregistrée
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading || !hasChanges}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Enregistrement...' : 'Enregistrer les images'}
          </button>
        </div>
      </div>
    </div>
  );
};
