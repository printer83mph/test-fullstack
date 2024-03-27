import axios from 'axios';
import useSWR from 'swr';
import fetcher from '../util/fetcher';

export default function useStuff() {
  const {
    data: stuff,
    isLoading,
    error,
    mutate,
  } = useSWR<{ things: Record<string, string> }>('/api/stuff', fetcher);

  const addNewThing = async () => {
    const newData = { key: `hi: ${Date.now()}`, value: 'people' };
    await axios.post<string>('/api/stuff', newData);
    mutate((oldStuff) => ({ ...oldStuff, ...newData }));
    // eslint-disable-next-line no-alert
    // alert(JSON.stringify(newData));
  };

  return { stuff, isLoading, error, addNewThing };
}
