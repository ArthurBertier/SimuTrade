import { invoke } from '@tauri-apps/api/tauri';

interface AuthError {
  message: string;
}

export const login = async (email: string, password: string): Promise<any> => {
  try {
    const response: any = await invoke('login', { payload: { email, password } });
    console.log(response)
    localStorage.setItem('user_id', response?.user_id);
    return response;
  } catch (error) {
    console.log(error);
    const authError = { message: 'Login failed' };
    throw authError;
  }
};

export const register = async (email: string, password: string): Promise<any> => {
  try {
    const response: any = await invoke('register', { payload: { email, password } });
    // Supposons que la réponse contienne l'ID de l'utilisateur
    localStorage.setItem('user_id', response?.user_id);
    return response;
  } catch (error) {
    console.log(error);
    const authError: AuthError = { message: 'Registration failed' };
    throw authError;
  }
};
