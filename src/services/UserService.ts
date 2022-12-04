import API_URL from '../website.config';
import generateHeaders from './HeaderService';

const getPosts = async () => {
  return await fetch(`${API_URL}auth/register`, {
    headers: generateHeaders(),
  });
}

const getPrivatePosts = async () => {
  return await fetch(`${API_URL}auth/register`, {
    headers: generateHeaders()
  });
}

export {getPosts, getPrivatePosts}
