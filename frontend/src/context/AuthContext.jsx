import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('indlocation_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const connecter = async (email, motDePasse) => {
    const { data } = await api.post('/auth/connecter', { email, motDePasse });
    localStorage.setItem('indlocation_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const inscrire = async (nom, email, telephone, motDePasse) => {
    const { data } = await api.post('/auth/inscrire', {
      nom,
      email,
      telephone,
      motDePasse,
    });
    localStorage.setItem('indlocation_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const deconnecter = () => {
    localStorage.removeItem('indlocation_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, connecter, inscrire, deconnecter }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
};
