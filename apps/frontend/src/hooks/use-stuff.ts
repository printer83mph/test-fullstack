import useSWR, { useSWRConfig } from 'swr';
import fetcher from '../util/fetcher';
import axios from 'axios';

export default function useStuff() {
  const {
    data: stuff,
    isLoading,
    error,
  } = useSWR<{ things: Record<string, string> }>('/api/stuff', fetcher);
  const { mutate } = useSWRConfig();

  const addNewThing = async () => {
    const newData = { key: `hi: ${Date.now()}`, value: 'people' };

    const optimisticData = {
      things: { ...stuff.things, [newData.key]: newData.value },
    };

    mutate(
      '/api/stuff',
      async () => {
        await axios.post<string>(
          `${import.meta.env.VITE_BACKEND_URL}/api/stuff`,
          newData,
        );
        return fetcher('/api/stuff');
      },
      // set revalidate false since we already hit the route in our async fn call!
      { optimisticData, revalidate: false },
    );
  };

  return { stuff, isLoading, error, addNewThing };
}
