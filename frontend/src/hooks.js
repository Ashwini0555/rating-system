import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from './api';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useList(url, defaultSort) {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ sortBy: defaultSort, order: 'asc' });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const debounced = useDebounce(filters);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(url, { params: { ...debounced, ...sort } });
      setData(res.data);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [url, debounced, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const onSort = (key) =>
    setSort((s) => ({ sortBy: key, order: s.sortBy === key && s.order === 'asc' ? 'desc' : 'asc' }));
  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return { data, loading, error, filters, setFilter, sort, onSort, reload: load };
}
