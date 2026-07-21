import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// ⚠️ Demonstração apenas — PINs visíveis no código não são seguros.
// Quando o backend estiver pronto, essa lista e a validação devem migrar pra lá.
const USERS = [
  { id: 1, name: 'Ana Silva', role: 'admin', pin: '1234', label: 'Administradora' },
  { id: 2, name: 'João Pedro', role: 'operator', pin: '5678', label: 'Operador de Caixa' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  const login = (userId, pin) => {
    const user = USERS.find((u) => u.id === Number(userId));
    if (!user) {
      setLoginError('Usuário não encontrado.');
      return false;
    }
    if (user.pin !== pin) {
      setLoginError('PIN incorreto.');
      return false;
    }
    setLoginError('');
    setCurrentUser(user);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginError('');
  };

  return (
    <AuthContext.Provider value={{ users: USERS, currentUser, login, logout, loginError, setLoginError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);