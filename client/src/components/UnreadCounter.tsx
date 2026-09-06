import type { ReactElement } from 'react';
export const UnreadCounter = ({ count }: { count: number }): ReactElement | null => count > 0 ? <span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">{count > 99 ? '99+' : count}</span> : null;
