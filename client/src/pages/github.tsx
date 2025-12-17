import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { GitHubRepos } from "@/components/github/github-repos";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { GitHubRepo } from "@shared/schema";

export default function GitHubPage() {
  const { toast } = useToast();
  const [hasToken, setHasToken] = useState(false);

  const { data: tokenStatus } = useQuery<{ hasToken: boolean }>({
    queryKey: ["/api/github/status"],
  });

  useEffect(() => {
    if (tokenStatus?.hasToken) {
      setHasToken(true);
    }
  }, [tokenStatus]);

  const {
    data: repos = [],
    isLoading,
    error,
  } = useQuery<GitHubRepo[]>({
    queryKey: ["/api/github/repos"],
    enabled: hasToken,
  });

  const setTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await apiRequest("POST", "/api/github/token", { token });
      return res.json();
    },
    onSuccess: () => {
      setHasToken(true);
      queryClient.invalidateQueries({ queryKey: ["/api/github/repos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/github/status"] });
      toast({
        title: "GitHub connected",
        description: "Your GitHub account has been linked successfully.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to connect GitHub",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto">
        <div className="px-4 py-8">
          <h1 className="text-2xl font-bold mb-2" data-testid="text-github-title">
            GitHub Repositories
          </h1>
          <p className="text-muted-foreground mb-6">
            Browse and manage your GitHub repositories
          </p>
        </div>

        <GitHubRepos
          repos={repos}
          isLoading={isLoading}
          error={error?.message || null}
          hasToken={hasToken || tokenStatus?.hasToken || false}
          onSetToken={(token) => setTokenMutation.mutate(token)}
        />
      </main>
    </div>
  );
}
