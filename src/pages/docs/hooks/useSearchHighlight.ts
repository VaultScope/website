import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchHighlight() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeQuery, setActiveQuery] = useState(query);

  useEffect(() => {
    setActiveQuery(query);
  }, [query]);

  const clearHighlight = () => {
    setActiveQuery('');
    searchParams.delete('q');
    setSearchParams(searchParams, { replace: true });
  };

  return {
    query: activeQuery,
    clearHighlight,
    hasQuery: Boolean(activeQuery.trim()),
  };
}
