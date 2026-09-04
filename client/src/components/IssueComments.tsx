import type { ReactElement } from 'react';
import { useState } from 'react';
import { useAddIssueComment } from '../features/issues';
import type { IssueComment, IssueUser } from '../types/issue';

const name = (user: IssueUser) => typeof user === 'string' ? user : user.name;
export const IssueComments = ({ issueId, comments }: { issueId: string; comments: IssueComment[] }): ReactElement => { const [body, setBody] = useState(''); const add = useAddIssueComment(issueId); return <section><h3 className="font-bold text-slate-900">Comments</h3><div className="mt-3 flex gap-3"><input className="input" placeholder="Add a comment" value={body} onChange={(event) => setBody(event.target.value)} /><button className="button max-w-fit" onClick={() => void add.mutateAsync(body).then(() => setBody(''))}>Post</button></div><ul className="mt-4 space-y-3">{comments.map((comment) => <li className="rounded-lg bg-slate-50 p-3 text-sm" key={comment._id}><strong>{name(comment.authorId)}</strong><p className="mt-1 text-slate-600">{comment.body}</p></li>)}</ul></section>; };