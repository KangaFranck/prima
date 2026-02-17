import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://prima-8fvobd0l8-primacenters-projects.vercel.app/api'
  : 'http://localhost:3000/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    nom: string;
    prenom: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', response.data.token);
      
      // Configurer axios pour inclure le token dans les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  },

  setupAxiosInterceptors() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Intercepteur pour gérer les erreurs d'authentification
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }
}; 