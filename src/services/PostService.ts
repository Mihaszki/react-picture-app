import API_URL from '../website.config';
import generateHeaders from './HeaderService';

export async function getAllPosts() {
  return await fetch(`${API_URL}post`, { headers: generateHeaders(true) });
}

export async function getPost(id: string) {
  return await fetch(`${API_URL}post/${id}`, { headers: generateHeaders(true) });
}

export async function uploadPost(file: any, title: string, fileName: string) {
  const data = new FormData();
  data.append('file', file);
  data.append('title', title);
  data.append('filename', fileName);
  return await fetch(`${API_URL}post`, { body: data, method: 'POST', headers: generateHeaders(true) });
}

export async function addComment(postId: string, text: string) {
  return await fetch(`${API_URL}comment`, { body: JSON.stringify({postId, text}), method: 'POST', headers: generateHeaders() });
}

export async function removeComment(id: string, postId: string) {
  return await fetch(`${API_URL}comment/${id}`, { body: JSON.stringify({postId}), method: 'DELETE', headers: generateHeaders() });
}

export async function editComment(id: string, postId: string, text: string) {
  return await fetch(`${API_URL}comment/${id}`, { body: JSON.stringify({postId, text}), method: 'PUT', headers: generateHeaders() });
}

export async function likePost(postId: string) {
  return await fetch(`${API_URL}like`, { body: JSON.stringify({postId}), method: 'POST', headers: generateHeaders() });
}
