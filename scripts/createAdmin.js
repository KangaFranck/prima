import PocketBase from 'pocketbase';

async function createAdmin() {
  const pb = new PocketBase('https://primacenter.fly.dev');
  
  try {
    console.log(' Création de l\'admin...');
    
    // Créer l'admin
    const adminData = {
      email: 'communicationprimacenter@gmail.com',
      password: 'Prima@center2025',
      passwordConfirm: 'Prima@center2025'
    };
    
    const admin = await pb.admins.create(adminData);
    console.log(' Admin créé avec succès!');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    
  } catch (error) {
    console.error(' Erreur lors de la création de l\'admin:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('ℹ L\'admin existe déjà, testons la connexion...');
      
      try {
        const authData = await pb.admins.authWithPassword(
          'communicationprimacenter@gmail.com',
          'Prima@center2025'
        );
        console.log(' Connexion admin réussie!');
        console.log('Token:', authData.token.substring(0, 20) + '...');
      } catch (authError) {
        console.error(' Erreur de connexion:', authError.message);
      }
    }
  }
}

createAdmin();