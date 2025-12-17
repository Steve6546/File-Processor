import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Lock, Globe, GitBranch, Search, Key, AlertCircle } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { GitHubRepo } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface GitHubReposProps {
  repos: GitHubRepo[];
  isLoading: boolean;
  error: string | null;
  hasToken: boolean;
  onSetToken: (token: string) => void;
}

export function GitHubRepos({
  repos,
  isLoading,
  error,
  hasToken,
  onSetToken,
}: GitHubReposProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      onSetToken(tokenInput.trim());
      setTokenInput("");
    }
  };

  if (!hasToken) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                <SiGithub className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Connect GitHub</CardTitle>
                <CardDescription>
                  Link your GitHub account to view and import repositories
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitToken} className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter your GitHub Personal Access Token to connect your account.
                  You can create one in{" "}
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub Settings
                  </a>
                  .
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    data-testid="input-github-token"
                  />
                  <Button type="submit" disabled={!tokenInput.trim()} data-testid="button-connect-github">
                    <Key className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-destructive/50">
          <CardContent className="flex items-center gap-3 py-6">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium">Failed to load repositories</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-repos"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No repositories match your search" : "No repositories found"}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <Card key={repo.id} className="hover-elevate" data-testid={`card-repo-${repo.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline truncate"
                        >
                          {repo.name}
                        </a>
                        {repo.private ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center flex-wrap gap-2">
                        {repo.language && (
                          <Badge variant="secondary" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          Updated {formatDistanceToNow(new Date(repo.updated_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
