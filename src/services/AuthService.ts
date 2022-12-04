import API_URL from '../website.config';

const login = async (username: string, password: string) => {
  return await fetch(`${API_URL}auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(async (response: Response) => {
      const res = await response.clone().json();
      localStorage.setItem('user', res.accessToken as string);
      return await response;
    });
}

const logout = () => {
  localStorage.removeItem('user');
}

const register = async (username: string, email: string, password: string) => {
  return await fetch(`${API_URL}auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  });
}

const getCurrentUser = () => {
  return localStorage.getItem('user') as any;
}

const isLoggedIn = () => {
  return localStorage.getItem('user') === null ? false : true;
}

export { login, isLoggedIn, logout, register, getCurrentUser }