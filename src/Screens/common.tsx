import ky from 'ky';
import { API_BASE_URL } from "./constants";

// @ts-ignore
const getAuthToken = () => JSON.parse(localStorage.getItem('auth'))?.access;

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 100000,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken();
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    ]
  }
});


export const getAuthDetails = () => JSON.parse(localStorage.getItem('auth'));
