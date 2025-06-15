import { router } from 'expo-router';

export const useAuth = () => {
  const logout = () => {
    // Aqui você pode adicionar lógica adicional de logout se necessário
    // Por exemplo, limpar tokens, estado global, etc.
    router.replace('/');
  };

  return {
    logout
  };
}; 