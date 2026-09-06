export type SearchType = 'PROJECT' | 'TASK' | 'ISSUE' | 'SPRINT' | 'USER' | 'COMMENT';
export type SearchResult = { _id: string; type: SearchType; title: string; subtitle?: string; score: number; projectId?: string; entityType?: string; entityId?: string };
export type SearchResponse = { items: SearchResult[]; pagination: { page: number; limit: number; total: number; pages: number } };
