import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { SearchResponse, SearchType } from '../types/search';

export const searchKeys = { global: (query: string, type?: SearchType) => ['search', query, type] as const };
export const useGlobalSearch = (value: string, type?: SearchType) => {
  const [query, setQuery] = useState('');
  useEffect(() => { const timer = setTimeout(() => setQuery(value.trim()), 250); return () => clearTimeout(timer); }, [value]);
  return useQuery({ queryKey: searchKeys.global(query, type), queryFn: async () => (await apiClient.get<{ data: SearchResponse }>('/search', { params: { q: query, type, limit: 50 } })).data.data, enabled: query.length >= 2 });
};
