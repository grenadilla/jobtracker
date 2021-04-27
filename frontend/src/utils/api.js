const API = 'http://localhost:5000';
let token;

export function setAuthToken(newToken) {
  token = newToken;
}


/**
 * Sends a HTTP request using auth token
 * @param {string} method - GET, POST, PUT, DELETE, etc.
 * @param {string} endpoint - only include part after base domain, i.e. "/users"
 * @param {object} [body] - optional body of request, only applicable for non-GET requests, will be encoded as JSON
 * @return {Promise} returns a Promise that resolves to the response body, JSON decoded
 */
export async function request(method, endpoint, body) {
  const response = await fetch(`${API}${endpoint}`, {
    method,
    headers: {
      'Authorization': token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    throw new Error(await response.json());
  }

  return response.json();
}

export const isUserAlreadySignedUp = () => request('GET', '/user/exists');

export const createUser = ({ email, name, grade, gpa }) =>
  request('POST', '/user/create', { username: email, password: '', name, grade, gpa });

export const updateUser = ({ name, grade, gpa }) =>
  request('POST', '/user/edit', { name, grade, gpa });

export const createApplication = (postingId, status, portal) =>
  request('POST', '/application/create', { postingId, status, portal });

export const updateApplication = (applicationId, status, portal) =>
  request('POST', '/application/edit', { id: applicationId, status, portal });

export const getApplication = (applicationId) => request('GET', `/application/${applicationId}`);

export const addUserSkills = (skillIds) => request('POST', '/user/addskills', { skillIds });

export const updateUserSkills = (skillIds) => request('POST', '/user/updateskills', { skillIds });

// we cache allSkills in sessionStorage since it can be somewhat big
export const getAllSkills = async () => {
  let allSkills = JSON.parse(sessionStorage.allSkills || null);
  if (!allSkills) {
    allSkills = await request('GET', '/skill/all');
    sessionStorage.allSkills = JSON.stringify(allSkills);
  }
  return allSkills;
}

export const getCurrentUser = () => request('GET', '/user');

export const getCurrentUserSkills = () => request('GET', '/user/skills');
