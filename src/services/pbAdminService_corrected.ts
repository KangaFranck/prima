// ... existing code ...

  async createEvenement(evenement: any) {
    try {
      console.log('=== CRÉATION ÉVÉNEMENT - CORRECTION COMPLÈTE ===');
      console.log('Données reçues:', evenement);
      console.log('Utilisateur connecté:', pb.authStore.model);
      console.log('Token:', pb.authStore.token);
      
      const formData = new FormData();
      
      // Champs obligatoires pour événements
      formData.append('titre', evenement.titre || '');
      formData.append('description', evenement.description || '');
      formData.append('date', evenement.date || '');
      formData.append('lieu', evenement.lieu || '');
      formData.append('statut', evenement.statut || 'planifié');
      
      // Champs optionnels
      if (evenement.email) formData.append('email', evenement.email);
      
      // Affiche si présent
      if (evenement.affiche && evenement.affiche instanceof File) {
        formData.append('affiche', evenement.affiche);
      }
      
      console.log('FormData envoyé:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const record = await pb.collection('evenements').create(formData);
      console.log(' Événement créé avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la création de l\'événement:', error);
      console.error('Détails de l\'erreur:', error.data);
      throw error;
    }
  },

  async updateEvenement(id: string, evenement: any) {
    try {
      console.log('=== MISE À JOUR ÉVÉNEMENT - CORRECTION COMPLÈTE ===');
      console.log('ID:', id);
      console.log('Données reçues:', evenement);
      
      const formData = new FormData();
      
      // Champs obligatoires pour événements
      formData.append('titre', evenement.titre || '');
      formData.append('description', evenement.description || '');
      formData.append('date', evenement.date || '');
      formData.append('lieu', evenement.lieu || '');
      formData.append('statut', evenement.statut || 'planifié');
      
      // Champs optionnels
      if (evenement.email) formData.append('email', evenement.email);
      
      // Affiche si présent
      if (evenement.affiche && evenement.affiche instanceof File) {
        formData.append('affiche', evenement.affiche);
      }
      
      console.log('FormData envoyé pour mise à jour:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const record = await pb.collection('evenements').update(id, formData);
      console.log(' Événement mis à jour avec succès:', record);
      return record;
    } catch (error: any) {
      console.error(' Erreur lors de la mise à jour de l\'événement:', error);
      console.error('Détails de l\'erreur:', error.data);
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
