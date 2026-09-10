import { preview, VERSION } from './config.js';

const store = preview ? window.EnmsMock.createStore() : null;

export async function request(resource, params = {}, method = 'GET') {
  if (preview) {
    return {
      data: store.request(method, resource, params),
      meta: { source: 'mock', version: VERSION }
    };
  }

  const token = localStorage.getItem('hes_login_token');
  if (!token) {
    location.replace('/login');
    throw new Error('Vui lòng đăng nhập');
  }

  const query = method === 'GET' ? `?${new URLSearchParams(params)}` : '';
  const response = await fetch(`/api/enms/v1/${resource}${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    ...(method !== 'GET' ? { body: JSON.stringify(params) } : {})
  });

  if (response.status === 401) {
    location.replace('/login');
    throw new Error('Phiên đăng nhập đã hết hạn');
  }

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Không thể kết nối API');
  return result;
}

export async function allRows(resource, params) {
  const first = (await request(resource, { ...params, page: 1, pageSize: 1000 })).data;
  let items = first.items;
  for (let page = 2; page <= Math.ceil(first.total / 1000); page += 1) {
    items = items.concat((await request(resource, { ...params, page, pageSize: 1000 })).data.items);
  }
  return items;
}
