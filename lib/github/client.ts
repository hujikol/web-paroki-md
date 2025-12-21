import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

let octokitInstance: Octokit | null = null;
let tokenExpiry: number = 0;

export async function getOctokit(): Promise<Octokit> {
  const now = Date.now();
  
  // Reuse existing instance if token is still valid (with 5 min buffer)
  if (octokitInstance && tokenExpiry > now + 5 * 60 * 1000) {
    return octokitInstance;
  }

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;

  if (!appId || !privateKey || !installationId) {
    throw new Error(
      "Missing GitHub App credentials. Please set GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_INSTALLATION_ID"
    );
  }

  // Create new Octokit instance with GitHub App authentication
  octokitInstance = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey: privateKey.replace(/\\n/g, "\n"),
      installationId,
    },
  });

  // Installation tokens expire after 1 hour
  tokenExpiry = now + 60 * 60 * 1000;

  return octokitInstance;
}

export function getRepoConfig() {
  const owner = process.env.CONTENT_REPO_OWNER;
  const repo = process.env.CONTENT_REPO_NAME;

  if (!owner || !repo) {
    throw new Error(
      "Missing repository configuration. Please set CONTENT_REPO_OWNER and CONTENT_REPO_NAME"
    );
  }

  return { owner, repo };
}
