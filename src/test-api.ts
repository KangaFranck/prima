import axios from 'axios';

const API_URL = 'https://prima-pce4c6xwn-primacenters-projects.vercel.app/api';

async function testAPI() {
  try {
    // Test de la connexion à la base de données
    console.log('Test de la connexion à la base de données...');
    const dbTest = await axios.get(`${API_URL}/test-db`);
    console.log('Résultat:', dbTest.data);

    // Création du compte administrateur
    console.log('\nCréation du compte administrateur...');
    const registerResponse = await axios.post(`${API_URL}/auth/register`);
    console.log('Résultat:', registerResponse.data);

    // Test de connexion
    console.log('\nTest de connexion...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@primacenter.fr',
      password: 'admin123'
    });
    console.log('Résultat:', loginResponse.data);

  } catch (error: any) {
    console.error('Erreur:', error.response?.data || error.message);
  }
}

testAPI(); 