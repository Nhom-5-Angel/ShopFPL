// Admin API Client
const API_BASE = '/api';

// Get auth token from localStorage
function getAuthToken() {
  return localStorage.getItem('admin_token');
}

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login.html';
    throw new Error('Phiên đăng nhập đã hết hạn hoặc không có quyền truy cập');
  }

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response:', text.substring(0, 200));
    throw new Error(`Server trả về HTML thay vì JSON. Có thể endpoint không tồn tại hoặc có lỗi authentication. Status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra');
  }

  return data;
}

// Admin API functions
const adminAPI = {
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? '?' + queryString : ''}`);
  },

  getUserById: async (id) => {
    return apiRequest(`/admin/users/${id}`);
  },

  updateUserRole: async (userId, role) => {
    return apiRequest(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  resetUserPassword: async (userId, newPassword) => {
    return apiRequest(`/admin/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  },

  deleteUser: async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  toggleUserLock: async (userId, isLocked) => {
    return apiRequest(`/admin/users/${userId}/lock`, {
      method: 'PATCH',
      body: JSON.stringify({ isLocked }),
    });
  },
};

// Logout function
function handleLogout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/admin/login.html';
}
