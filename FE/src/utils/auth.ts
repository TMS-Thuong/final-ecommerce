import { getCookie } from './cookie';

export function getAuthHeader() {
  const token = getCookie('accessToken');

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`
  };
} 