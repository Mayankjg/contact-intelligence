// import axios from 'axios';

// const api = axios.create({
//   baseURL:
//     process.env.NEXT_PUBLIC_API_URL ||
//     'http://localhost:4000',

//   headers: {
//     'Content-Type': 'application/json',
//   },

//   withCredentials: true,
// });

// export default api;


//   -------------------------------------------------------------------------

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ||
//   'http://localhost:5000/api';

// export async function apiRequest<T>(
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<T> {
//   const response = await fetch(
//     `${API_URL}${endpoint}`,
//     {
//       ...options,

//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers || {}),
//       },
//     },
//   );

//   const contentType =
//     response.headers.get(
//       'content-type',
//     );

//   const data =
//     contentType?.includes(
//       'application/json',
//     )
//       ? await response.json()
//       : await response.text();

//   if (!response.ok) {
//     const message =
//       typeof data === 'object' &&
//       data !== null &&
//       'message' in data
//         ? Array.isArray(data.message)
//           ? data.message.join(', ')
//           : String(data.message)
//         : 'Something went wrong';

//     throw new Error(message);
//   }

//   return data as T;
// }



import { notifySuccessfulAction } from '@/lib/notification-events';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window === 'undefined'
      ? null
      : window.localStorage.getItem('contactiq_token');

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },

      cache: 'no-store',
    },
  );

  const contentType =
    response.headers.get('content-type');

  const data =
    contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    let message = 'Something went wrong';

    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data
    ) {
      const errorMessage =
        (data as {
          message?: unknown;
        }).message;

      if (Array.isArray(errorMessage)) {
        message =
          errorMessage.join(', ');
      } else if (
        typeof errorMessage === 'string'
      ) {
        message = errorMessage;
      }
    }

    throw new Error(message);
  }

  const method = (options.method || 'GET').toUpperCase();

  if (
    method !== 'GET' &&
    method !== 'HEAD' &&
    !endpoint.startsWith('/auth/')
  ) {
    notifySuccessfulAction(endpoint, method);
  }

  return data as T;
}
