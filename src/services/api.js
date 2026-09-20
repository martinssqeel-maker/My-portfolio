/**
 * Frontend API Service Layer
 * Connects to the Express backend with automatic JWT token attachment
 */

const API_BASE = '/api';

export function getAuthToken() {
  return sessionStorage.getItem('admin_token') || null;
}

export function setAuthToken(token) {
  if (token) {
    sessionStorage.setItem('admin_token', token);
  } else {
    sessionStorage.removeItem('admin_token');
  }
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// -------------------------------------------------------------
// Public Endpoints
// -------------------------------------------------------------

export async function fetchProjects() {
  return request('/projects');
}

export async function fetchProject(slug) {
  return request(`/projects/${slug}`);
}

export async function fetchSkills() {
  return request('/skills');
}

export async function fetchExperience() {
  return request('/experience');
}

export async function submitContactMessage(payload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// -------------------------------------------------------------
// Admin Authentication Endpoints
// -------------------------------------------------------------

export async function adminLogin(email, password) {
  const res = await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.token) {
    setAuthToken(res.token);
  }
  return res;
}

export async function adminLogout() {
  try {
    await request('/admin/logout', { method: 'POST' });
  } finally {
    setAuthToken(null);
  }
}

export async function adminGetMe() {
  return request('/admin/me');
}

// -------------------------------------------------------------
// Admin Data & Management Endpoints
// -------------------------------------------------------------

export async function adminGetStats() {
  return request('/admin/stats');
}

export async function adminGetMessages(status = 'all') {
  return request(`/admin/messages?status=${status}`);
}

export async function adminUpdateMessageStatus(id, status) {
  return request(`/admin/messages/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function adminDeleteMessage(id) {
  return request(`/admin/messages/${id}`, {
    method: 'DELETE',
  });
}

export async function adminCreateProject(data) {
  return request('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateProject(id, data) {
  return request(`/admin/projects/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteProject(id) {
  return request(`/admin/projects/${id}`, {
    method: 'DELETE',
  });
}

export async function adminCreateSkill(data) {
  return request('/admin/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateSkill(id, data) {
  return request(`/admin/skills/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteSkill(id) {
  return request(`/admin/skills/${id}`, {
    method: 'DELETE',
  });
}

export async function adminCreateExperience(data) {
  return request('/admin/experience', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminUpdateExperience(id, data) {
  return request(`/admin/experience/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function adminDeleteExperience(id) {
  return request(`/admin/experience/${id}`, {
    method: 'DELETE',
  });
}
