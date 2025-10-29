import useSWR from 'swr';

const fetcher = async (url) => {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load calendar data');
  }
  return response.json();
};

function useCalendarData() {
  const { data, error, isLoading, mutate } = useSWR('/api/calendar', fetcher, {
    revalidateOnFocus: false,
  });

  return {
    events: data?.events ?? [],
    isLoading,
    error,
    refresh: mutate,
  };
}

export default useCalendarData;

