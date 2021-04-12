const API = 'http://127.0.0.1:5000';

export class APIError extends Error {
  constructor({ message, status, type }) {
    super(message);
    this.status = status;
    this.type = type;
    this.name = 'APIError';
  }
};

async function request(method, endpoint, body) {
  const response = await fetch(API + endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    throw new APIError(await response.json());
  }

  return response.json();
}

export const searchApplications = (page, num_per_page, query) =>
  fetch(`http://127.0.0.1:5000/application/search?page=${page}&per_page=${num_per_page}${query ? '&query='+query : ''}`)
  .then((response) => response.json())
  // request('GET', `/application/search?page=${page}&per_page=${num_per_page}${query ? '&query='+query : ''}`);

export const createApplication = data => request('POST', `/application`, data);

export const updateApplication = data => request('PUT', '/application', data);

export const deleteApplication = id => request('DELETE', `/application/${id}`);
