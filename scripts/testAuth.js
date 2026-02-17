import PocketBase from 'pocketbase';

async function testAuth() {
  const pb = new PocketBase('https://primacenter.fly.dev');
  
  try {
    console.log(' Test de connexion admin...');
    
    // Utiliser la méthode directe pour l'authentification admin
    const authData = await pb.admins.authWithPassword(
      'communicationprimacenter@gmail.com',
      'Prima@center2025'
    );
    
    console.log(' Connexion admin réussie!');
    console.log('Token:', authData.token.substring(0, 20) + '...');
    console.log('Admin ID:', authData.record.id);
    
  } catch (error) {
    console.error(' Erreur de connexion:', error.message);
    console.error('Status:', error.status);
    
    // Test avec l'URL directe
    console.log(' Test avec l\'URL directe...');
    try {
      const response = await fetch('https://primacenter.fly.dev/api/admins/auth-with-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identity: 'communicationprimacenter@gmail.com',
          password: 'Prima@center2025'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(' Connexion directe réussie!');
        console.log('Token:', data.token.substring(0, 20) + '...');
      } else {
        console.error(' Erreur directe:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Response:', errorText);
      }
    } catch (directError) {
      console.error(' Erreur directe:', directError.message);
    }
  }
}

testAuth();