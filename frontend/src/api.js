import axios from 'axios';
import { io } from 'socket.io-client';

// Same-origin by default: Render and Vercel both serve the API next to the app.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  '';

const TOKEN_KEY = 'crowdfix.token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY)),
};

export const api = axios.create({ baseURL: `${API_URL}/api`, timeout: 20000 });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function errorMessage(err) {
  return err?.response?.data?.message || err?.message || 'Something went wrong';
}

// Serverless hosts (Vercel) cannot keep WebSocket connections, so live updates are
// turned off there and pages simply load fresh data.
const noopSocket = { on() {}, off() {}, emit() {} };
const liveUpdates = !(typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app') && !API_URL);

let socket;
export function getSocket() {
  if (!liveUpdates) return noopSocket;
  if (!socket) socket = io(API_URL || undefined, { transports: ['websocket', 'polling'], autoConnect: true });
  return socket;
}
