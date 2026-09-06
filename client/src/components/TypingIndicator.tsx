import type { ReactElement } from 'react';
export const TypingIndicator = ({ names }: { names: string[] }): ReactElement | null => names.length ? <p className="px-4 pb-2 text-xs text-slate-500">{names.join(', ')} {names.length === 1 ? 'is' : 'are'} typing...</p> : null;
