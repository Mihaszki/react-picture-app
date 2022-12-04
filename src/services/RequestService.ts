import { logout } from './AuthService';

const requestJson = async (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<any> => {
  try {
    const res: Response = await fetch(input, init);
    if (!res.ok) {
      if (res.status === 401) {
        console.log('logout');
        logout();
      }
      return Promise.reject(await res.json());
    }
    return await res.json();
  } catch (error: any) {
    return Promise.reject(await error.json());
  }
}

export default requestJson