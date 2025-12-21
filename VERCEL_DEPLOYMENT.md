# Vercel Deployment Guide

## Build Error Fix

If you're seeing this error during Vercel deployment:
```
Error: [@octokit/auth-app] installationId option is required for installation authentication.
```

This means the GitHub App environment variables are not set in Vercel.

## Quick Fix: Set Environment Variables in Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (`web-paroki-md`)
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
GITHUB_APP_ID=your_app_id
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----
your_private_key_here
-----END RSA PRIVATE KEY-----
GITHUB_APP_INSTALLATION_ID=your_installation_id
CONTENT_REPO_OWNER=your_github_username
CONTENT_REPO_NAME=blog-content
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$10$your_bcrypt_hash
ADMIN_NAME=Your Name
ADMIN_EMAIL=your@email.com
NEXTAUTH_SECRET=Z4DdaGjg8kgebt3awwDsju/2AYnJZg2DbG1hV5xX9js=
NEXTAUTH_URL=https://your-domain.vercel.app
```

5. Click **Save**
6. Go to **Deployments** → Click **⋯** on latest deployment → **Redeploy**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add GITHUB_APP_ID
vercel env add GITHUB_APP_PRIVATE_KEY
vercel env add GITHUB_APP_INSTALLATION_ID
vercel env add CONTENT_REPO_OWNER
vercel env add CONTENT_REPO_NAME
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
vercel env add ADMIN_NAME
vercel env add ADMIN_EMAIL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Redeploy
vercel --prod
```

## Alternative: Skip Build-Time GitHub Access

If you haven't set up the GitHub App yet, you can deploy without static generation:

### Modify `app/(blog)/posts/[slug]/page.tsx`

Change this:
```typescript
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

To this:
```typescript
export async function generateStaticParams() {
  // Skip static generation during build if GitHub credentials not available
  if (!process.env.GITHUB_APP_ID) {
    return [];
  }
  
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.warn('Failed to generate static params:', error);
    return [];
  }
}
```

This will allow the build to succeed, and pages will be generated on-demand (ISR) instead of at build time.

## Complete Setup Checklist

- [ ] Create GitHub App (if not done yet)
- [ ] Install GitHub App on content repository
- [ ] Create content repository (`blog-content`)
- [ ] Set all environment variables in Vercel
- [ ] Update `NEXTAUTH_URL` to your Vercel domain
- [ ] Redeploy

## Testing After Deployment

1. Visit your Vercel URL
2. Go to `/admin/login`
3. Login with your credentials
4. Create a test post
5. Verify it appears on the blog

## Need Help?

See the main README.md for detailed GitHub App setup instructions.
