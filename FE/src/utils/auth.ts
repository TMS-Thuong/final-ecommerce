export function getAuthHeader() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
  };
} 