import axios from 'axios';

export default async function fetcher(key: string) {
  return (await axios.get(`${import.meta.env.VITE_BACKEND_URL}${key}`)).data;
}
