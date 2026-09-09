import type { ReactElement } from 'react';
import { useState } from 'react';
import { useBranches, useCommits, useConnectRepository, useDisconnectRepository, useGithubIssues, usePullRequests, useRepository } from '../features/github';
import { CommitList } from './CommitList';
import { GitHubIssueList } from './GitHubIssueList';
import { PullRequestList } from './PullRequestList';
import { RepositoryOverview } from './RepositoryOverview';

export const RepositorySettings = ({ projectId }: { projectId: string }): ReactElement => {
  const repository = useRepository(projectId);
  const connect = useConnectRepository(projectId);
  const disconnect = useDisconnectRepository(projectId);
  const hasRepository = Boolean(repository.data);
  const branches = useBranches(projectId, hasRepository);
  const commits = useCommits(projectId, hasRepository);
  const pullRequests = usePullRequests(projectId, hasRepository);
  const issues = useGithubIssues(projectId, hasRepository);
  const [owner, setOwner] = useState('');
  const [name, setName] = useState('');
  return <section className="mx-auto max-w-2xl space-y-6 rounded-xl bg-white p-6 shadow-sm"><div><p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">GitHub integration</p><h2 className="mt-1 text-2xl font-bold">Repository</h2></div>{hasRepository && repository.data ? <><RepositoryOverview repository={repository.data} /><div className="flex justify-end"><button type="button" className="font-semibold text-red-600" disabled={disconnect.isPending} onClick={() => void disconnect.mutateAsync()}>Disconnect repository</button></div><div className="space-y-6"><div><h3 className="mb-2 text-lg font-bold">Branches</h3><div className="flex flex-wrap gap-2">{(branches.data ?? []).map((branch) => <span className="rounded-full bg-slate-100 px-3 py-1 text-sm" key={branch.name}>{branch.name}</span>)}</div></div><CommitList commits={commits.data ?? []} /><PullRequestList pullRequests={pullRequests.data ?? []} /><GitHubIssueList issues={issues.data ?? []} /></div></> : <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); void connect.mutateAsync({ owner, name }); }}><p className="text-sm text-slate-500">Connect a repository using its GitHub owner and repository name.</p><label className="block text-sm font-semibold">Owner<input className="input mt-2" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="octocat" required /></label><label className="block text-sm font-semibold">Repository name<input className="input mt-2" value={name} onChange={(event) => setName(event.target.value)} placeholder="Hello-World" required /></label><button className="button max-w-fit" disabled={connect.isPending}>{connect.isPending ? 'Connecting...' : 'Connect repository'}</button></form>}</section>;
};