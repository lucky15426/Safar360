const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';  // 👈 FIXED: Correct env var + fallback

export const getDocuments = async () => {
  const res = await fetch(`${API_BASE}/documents`, {
    credentials: 'include'  // 👈 ADDED: Clerk auth cookies
  });
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
};

export const uploadDocument = async (formData) => {
  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    credentials: 'include',  // 👈 ADDED: Clerk auth cookies
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
};

export const deleteDocument = async (id) => {
  const res = await fetch(`${API_BASE}/documents/${id}`, { 
    method: 'DELETE',
    credentials: 'include'  // 👈 ADDED: Clerk auth cookies
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
};
