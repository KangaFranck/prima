import { pb, getFileUrl } from './pbClient';

export const adminService = {
  // BOUTIQUES
  async getBoutiques() {
    try {
      const records = await pb.collection('boutiques').getFullList();
      return records.map(record => ({
        id: record.id,
        nom: record.nom,
        description: record.description_,
        logo: record.logo ? getFileUrl(record, record.logo) : null,
        image: record.image ? getFileUrl(record, record.image) : null,
        horaires: record.horaires,
        heureOuverture: record.heureOuverture,
        heureFermeture: record.heureFermeture,
        openSunday: record.openSunday,
        statut: record.statut,
        universe: record.universe,
        telephone: record.telephone,
        email: record.email,
        instagram: record.instagram,
        facebook: record.facebook,
        tiktok: record.tiktok,
        createdAt: record.created,
        updatedAt: record.updated
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des boutiques:', error);
      throw error;
    }
  },

  async createBoutique(boutique: any) {
    try {
      console.log('=== CRÉATION BOUTIQUE - DIAGNOSTIC COMPLET ===');
      console.log('Données reçues:', boutique);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);
      
      // VALIDATION DES DONNÉES OBLIGATOIRES
      if (!boutique.nom || boutique.nom.trim() === '') {
        throw new Error('Le nom de la boutique est obligatoire');
      }
      if (!boutique.description || boutique.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      
      const formData = new FormData();
      
      // Champs obligatoires pour boutiques
      formData.append('nom', boutique.nom.trim());
      formData.append('description_', boutique.description.trim());
      formData.append('horaires', boutique.horaires || '');
      formData.append('openSunday', boutique.openSunday ? 'true' : 'false');
      formData.append('statut', boutique.statut || 'actif');
      formData.append('universe', boutique.universe || 'Général');
      
      // Heures d'ouverture et fermeture - conversion en format date ISO
      if (boutique.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${boutique.heureOuverture}:00.000Z`);
      } else {
        // Valeur par défaut si pas d'heure
        formData.append('heureOuverture', '2000-01-01T09:00:00.000Z');
      }
      
      if (boutique.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${boutique.heureFermeture}:00.000Z`);
      } else {
        // Valeur par défaut si pas d'heure
        formData.append('heureFermeture', '2000-01-01T18:00:00.000Z');
      }
      
      // Champs optionnels - seulement si remplis
      if (boutique.telephone) formData.append('telephone', boutique.telephone);
      if (boutique.email) formData.append('email', boutique.email);
      if (boutique.instagram) formData.append('instagram', boutique.instagram);
      if (boutique.facebook) formData.append('facebook', boutique.facebook);
      if (boutique.tiktok) formData.append('tiktok', boutique.tiktok);
      
      // Fichiers - seulement si présents
      if (boutique.logo && boutique.logo instanceof File) {
        formData.append('logo', boutique.logo);
      }
      if (boutique.image && boutique.image instanceof File) {
        formData.append('image', boutique.image);
      }
      
      console.log('=== FORMDATA FINAL ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      console.log('=== TENTATIVE DE CRÉATION ===');
      const record = await pb.collection('boutiques').create(formData);
      console.log('✅ Boutique créée avec succès:', record);
      return record;
    } catch (error: any) {
      console.error('❌ Erreur lors de la création de la boutique:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },

  async updateBoutique(id: string, boutique: any) {
    try {
      console.log('=== MISE À JOUR BOUTIQUE - DIAGNOSTIC COMPLET ===');
      console.log('ID:', id);
      console.log('Données reçues:', boutique);
      
      // VALIDATION DES DONNÉES OBLIGATOIRES
      if (!boutique.nom || boutique.nom.trim() === '') {
        throw new Error('Le nom de la boutique est obligatoire');
      }
      if (!boutique.description || boutique.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      
      const formData = new FormData();
      
      // Champs obligatoires pour boutiques
      formData.append('nom', boutique.nom.trim());
      formData.append('description_', boutique.description.trim());
      formData.append('horaires', boutique.horaires || '');
      formData.append('openSunday', boutique.openSunday ? 'true' : 'false');
      formData.append('statut', boutique.statut || 'actif');
      formData.append('universe', boutique.universe || 'Général');
      
      // Heures d'ouverture et fermeture - conversion en format date ISO
      if (boutique.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${boutique.heureOuverture}:00.000Z`);
      } else {
        formData.append('heureOuverture', '2000-01-01T09:00:00.000Z');
      }
      
      if (boutique.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${boutique.heureFermeture}:00.000Z`);
      } else {
        formData.append('heureFermeture', '2000-01-01T18:00:00.000Z');
      }
      
      // Champs optionnels - seulement si remplis
      if (boutique.telephone) formData.append('telephone', boutique.telephone);
      if (boutique.email) formData.append('email', boutique.email);
      if (boutique.instagram) formData.append('instagram', boutique.instagram);
      if (boutique.facebook) formData.append('facebook', boutique.facebook);
      if (boutique.tiktok) formData.append('tiktok', boutique.tiktok);
      
      // Fichiers - seulement si présents
      if (boutique.logo && boutique.logo instanceof File) {
        formData.append('logo', boutique.logo);
      }
      if (boutique.image && boutique.image instanceof File) {
        formData.append('image', boutique.image);
      }
      
      console.log('=== FORMDATA FINAL POUR MISE À JOUR ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const record = await pb.collection('boutiques').update(id, formData);
      console.log('✅ Boutique mise à jour avec succès:', record);
      return record;
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de la boutique:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      throw error;
    }
  },

  async deleteBoutique(id: string) {
    try {
      await pb.collection('boutiques').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la boutique:', error);
      throw error;
    }
  },

  // RESTAURANTS
  async getRestaurants() {
    try {
      const records = await pb.collection('restaurants').getFullList();
      return records.map(record => ({
        id: record.id,
        nom: record.nom,
        description: record.description,
        logo: record.logo ? getFileUrl(record, record.logo) : null,
        image: record.image ? getFileUrl(record, record.image) : null,
        horaires: record.horaires,
        heureOuverture: record.heureOuverture,
        heureFermeture: record.heureFermeture,
        openSunday: record.oepnsonday,
        statut: record.staut,
        universe: record.universe,
        telephone: record.telephone,
        email: record.mail,
        instagram: record.Instagram,
        facebook: record.facebook,
        tiktok: record.tiktok,
        createdAt: record.created,
        updatedAt: record.updated
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      throw error;
    }
  },

  async createRestaurant(restaurant: any) {
    try {
      console.log('=== CRÉATION RESTAURANT - CORRECTION COMPLÈTE ===');
      console.log('Données reçues:', restaurant);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);

      const formData = new FormData();

      // Champs obligatoires
      formData.append('nom', restaurant.nom || '');
      formData.append('description', restaurant.description || '');
      formData.append('horaires', restaurant.horaires || '');
      formData.append('staut', restaurant.statut || 'actif');
      formData.append('oepnsonday', restaurant.openSunday ? 'true' : 'false');

      // Heures d'ouverture et fermeture - conversion en format date ISO
      if (restaurant.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${restaurant.heureOuverture}:00.000Z`);
      } else {
        formData.append('heureOuverture', '2000-01-01T00:00:00.000Z');
      }
      if (restaurant.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${restaurant.heureFermeture}:00.000Z`);
      } else {
        formData.append('heureFermeture', '2000-01-01T00:00:00.000Z');
      }

      // Champs optionnels
      formData.append('universe', restaurant.universe || 'Général');
      if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
      if (restaurant.email) formData.append('mail', restaurant.email);
      if (restaurant.instagram) formData.append('Instagram', restaurant.instagram);
      if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
      if (restaurant.tiktok) formData.append('tiktok', restaurant.tiktok);

      // Fichiers - seulement si présents
      if (restaurant.logo && restaurant.logo instanceof File) {
        formData.append('logo', restaurant.logo);
      }
      if (restaurant.image && restaurant.image instanceof File) {
        formData.append('image', restaurant.image);
      }

      console.log('FormData envoyé (avec toutes les corrections):');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const record = await pb.collection('restaurants').create(formData);
      console.log(' Restaurant créé avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la création du restaurant (globale):', error);
      console.error('Détails de l\'erreur (globale):', error.data);
      throw error;
    }
  },

  async updateRestaurant(id: string, restaurant: any) {
    try {
      const formData = new FormData();

      formData.append('nom', restaurant.nom || '');
      formData.append('description', restaurant.description || '');
      formData.append('horaires', restaurant.horaires || '');
      formData.append('staut', restaurant.statut || 'actif');
      formData.append('oepnsonday', restaurant.openSunday ? 'true' : 'false');

      if (restaurant.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${restaurant.heureOuverture}:00.000Z`);
      }
      if (restaurant.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${restaurant.heureFermeture}:00.000Z`);
      }

      formData.append('universe', restaurant.universe || 'Général');
      if (restaurant.telephone) formData.append('telephone', restaurant.telephone);
      if (restaurant.email) formData.append('mail', restaurant.email);
      if (restaurant.instagram) formData.append('Instagram', restaurant.instagram);
      if (restaurant.facebook) formData.append('facebook', restaurant.facebook);
      if (restaurant.tiktok) formData.append('tiktok', restaurant.tiktok);

      if (restaurant.logo && restaurant.logo instanceof File) {
        formData.append('logo', restaurant.logo);
      }
      if (restaurant.image && restaurant.image instanceof File) {
        formData.append('image', restaurant.image);
      }

      const record = await pb.collection('restaurants').update(id, formData);
      return record;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du restaurant:', error);
      throw error;
    }
  },

  async deleteRestaurant(id: string) {
    try {
      await pb.collection('restaurants').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du restaurant:', error);
      throw error;
    }
  },

  // LOISIRS
  async getLoisirs() {
    try {
      const records = await pb.collection('loisirs').getFullList();
      return records.map(record => ({
        id: record.id,
        nom: record.nom,
        description: record.description,
        logo: record.logo ? getFileUrl(record, record.logo) : null,
        image: record.image ? getFileUrl(record, record.image) : null,
        horaires: record.horaires,
        heureOuverture: record.heureOuverture,
        heureFermeture: record.heureFermeture,
        openSunday: record.opensonday,
        statut: record.statut,
        universe: record.universe,
        telephone: record.telephone,
        email: record.email,
        instagram: record.instagram,
        facebook: record.facebook,
        tiktok: record.tiktok,
        createdAt: record.created,
        updatedAt: record.updated
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des loisirs:', error);
      throw error;
    }
  },

  async createLoisir(loisir: any) {
    try {
      console.log('=== CRÉATION LOISIR ===');
      console.log('Données reçues:', loisir);
      
      const formData = new FormData();
      
      // Champs obligatoires pour loisirs
      formData.append('nom', loisir.nom || '');
      formData.append('description', loisir.description || '');
      formData.append('horaires', loisir.horaires || '');
      formData.append('opensonday', loisir.openSunday ? 'true' : 'false');
      formData.append('statut', loisir.statut || 'actif');
      formData.append('universe', loisir.universe || 'Général');
      
      // Heures d'ouverture et fermeture - conversion en format date ISO
      if (loisir.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${loisir.heureOuverture}:00.000Z`);
      }
      if (loisir.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${loisir.heureFermeture}:00.000Z`);
      }
      
      // Champs optionnels - seulement si remplis
      if (loisir.telephone) formData.append('telephone', loisir.telephone);
      if (loisir.email) formData.append('email', loisir.email);
      if (loisir.instagram) formData.append('instagram', loisir.instagram);
      if (loisir.facebook) formData.append('facebook', loisir.facebook);
      if (loisir.tiktok) formData.append('tiktok', loisir.tiktok);
      
      // Fichiers - seulement si présents
      if (loisir.logo && loisir.logo instanceof File) {
        formData.append('logo', loisir.logo);
      }
      if (loisir.image && loisir.image instanceof File) {
        formData.append('image', loisir.image);
      }
      
      const record = await pb.collection('loisirs').create(formData);
      console.log('Loisir créé avec succès:', record);
      return record;
    } catch (error) {
      console.error('Erreur lors de la création du loisir:', error);
      throw error;
    }
  },

  async updateLoisir(id: string, loisir: any) {
    try {
      const formData = new FormData();
      
      formData.append('nom', loisir.nom || '');
      formData.append('description', loisir.description || '');
      formData.append('horaires', loisir.horaires || '');
      formData.append('opensonday', loisir.openSunday ? 'true' : 'false');
      formData.append('statut', loisir.statut || 'actif');
      formData.append('universe', loisir.universe || 'Général');
      
      if (loisir.heureOuverture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureOuverture', `${today}T${loisir.heureOuverture}:00.000Z`);
      }
      if (loisir.heureFermeture) {
        const today = new Date().toISOString().split('T')[0];
        formData.append('heureFermeture', `${today}T${loisir.heureFermeture}:00.000Z`);
      }
      
      if (loisir.telephone) formData.append('telephone', loisir.telephone);
      if (loisir.email) formData.append('email', loisir.email);
      if (loisir.instagram) formData.append('instagram', loisir.instagram);
      if (loisir.facebook) formData.append('facebook', loisir.facebook);
      if (loisir.tiktok) formData.append('tiktok', loisir.tiktok);
      
      if (loisir.logo && loisir.logo instanceof File) {
        formData.append('logo', loisir.logo);
      }
      if (loisir.image && loisir.image instanceof File) {
        formData.append('image', loisir.image);
      }
      
      const record = await pb.collection('loisirs').update(id, formData);
      return record;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du loisir:', error);
      throw error;
    }
  },

  async deleteLoisir(id: string) {
    try {
      await pb.collection('loisirs').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression du loisir:', error);
      throw error;
    }
  },

  // ÉVÉNEMENTS - DIAGNOSTIC COMPLET
  async getEvenements() {
    try {
      const records = await pb.collection('evenements').getFullList();
      return records.map(record => ({
        id: record.id,
        titre: record.titre,
        title: record.titre, // Alias pour compatibilité
        description: record.description,
        date: record.date,
        lieu: record.lieu,
        statut: record.statut,
        affiche: record.affiche ? getFileUrl(record, record.affiche) : null,
        createdAt: record.created,
        updatedAt: record.updated
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },

  async createEvenement(evenement: any) {
    try {
      console.log('=== DIAGNOSTIC COMPLET - CRÉATION ÉVÉNEMENT ===');
      console.log('Données reçues:', evenement);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);
      
      // VÉRIFICATION DES DONNÉES
      console.log('=== VÉRIFICATION DES DONNÉES ===');
      console.log('titre:', evenement.titre, typeof evenement.titre);
      console.log('description:', evenement.description, typeof evenement.description);
      console.log('date:', evenement.date, typeof evenement.date);
      console.log('lieu:', evenement.lieu, typeof evenement.lieu);
      console.log('statut:', evenement.statut, typeof evenement.statut);
      console.log('affiche:', evenement.affiche, typeof evenement.affiche, evenement.affiche instanceof File);
      
      const formData = new FormData();
      
      // VÉRIFICATION ET AJOUT DES CHAMPS
      if (!evenement.titre || evenement.titre.trim() === '') {
        throw new Error('Le titre est obligatoire');
      }
      formData.append('titre', evenement.titre.trim());
      
      if (!evenement.description || evenement.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      formData.append('description', evenement.description.trim());
      
      if (!evenement.date) {
        throw new Error('La date est obligatoire');
      }
      // Conversion de la date au format ISO
      const dateObj = new Date(evenement.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Format de date invalide');
      }
      formData.append('date', dateObj.toISOString());
      
      if (!evenement.lieu || evenement.lieu.trim() === '') {
        throw new Error('Le lieu est obligatoire');
      }
      formData.append('lieu', evenement.lieu.trim());
      
      if (!evenement.statut || !['planifié', 'annulé', 'terminé'].includes(evenement.statut)) {
        throw new Error('Le statut doit être planifié, annulé ou terminé');
      }
      formData.append('statut', evenement.statut);
      
      // AFFICHE - OBLIGATOIRE
      if (!evenement.affiche || !(evenement.affiche instanceof File)) {
        throw new Error('L\'affiche est obligatoire et doit être un fichier');
      }
      formData.append('affiche', evenement.affiche);
      
      console.log('=== FORMDATA FINAL ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      console.log('=== TENTATIVE DE CRÉATION ===');
      const record = await pb.collection('evenements').create(formData);
      console.log(' Événement créé avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la création de l\'événement:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },

  async updateEvenement(id: string, evenement: any) {
    try {
      console.log('=== MISE À JOUR ÉVÉNEMENT - DIAGNOSTIC COMPLET ===');
      console.log('ID:', id);
      console.log('Données reçues:', evenement);
      
      const formData = new FormData();
      
      // VÉRIFICATION ET AJOUT DES CHAMPS
      if (!evenement.titre || evenement.titre.trim() === '') {
        throw new Error('Le titre est obligatoire');
      }
      formData.append('titre', evenement.titre.trim());
      
      if (!evenement.description || evenement.description.trim() === '') {
        throw new Error('La description est obligatoire');
      }
      formData.append('description', evenement.description.trim());
      
      if (!evenement.date) {
        throw new Error('La date est obligatoire');
      }
      // Conversion de la date au format ISO
      const dateObj = new Date(evenement.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Format de date invalide');
      }
      formData.append('date', dateObj.toISOString());
      
      if (!evenement.lieu || evenement.lieu.trim() === '') {
        throw new Error('Le lieu est obligatoire');
      }
      formData.append('lieu', evenement.lieu.trim());
      
      if (!evenement.statut || !['planifié', 'annulé', 'terminé'].includes(evenement.statut)) {
        throw new Error('Le statut doit être planifié, annulé ou terminé');
      }
      formData.append('statut', evenement.statut);
      
      // AFFICHE - OBLIGATOIRE
      if (!evenement.affiche || !(evenement.affiche instanceof File)) {
        throw new Error('L\'affiche est obligatoire et doit être un fichier');
      }
      formData.append('affiche', evenement.affiche);
      
      console.log('=== FORMDATA FINAL POUR MISE À JOUR ===');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [FILE] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const record = await pb.collection('evenements').update(id, formData);
      console.log(' Événement mis à jour avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la mise à jour de l\'événement:', error);
      console.error('Type d\'erreur:', error.constructor.name);
      console.error('Message d\'erreur:', error.message);
      console.error('Code d\'erreur:', error.status);
      console.error('Détails de l\'erreur:', error.data);
      console.error('Stack trace:', error.stack);
      throw error;
    }
  },

  async deleteEvenement(id: string) {
    try {
      await pb.collection('evenements').delete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }
};
