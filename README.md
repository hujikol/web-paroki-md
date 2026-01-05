# Blog CMS - Next.js + GitHub Storage

A modern, stateless blog CMS built with Next.js 15 (App Router), using GitHub as the single source of truth for content storage and Vercel for serverless hosting. No traditional database required.

## Features

- ✅ **GitHub as Storage** - All content stored as Markdown files in a GitHub repository
- ✅ **WebP Image Optimization** - Automatic image conversion and optimization
- ✅ **GitHub App Authentication** - Secure repository operations
- ✅ **Password Authentication** - Simple username/password login for admins
- ✅ **Multi-Admin Support** - Add multiple admin users via environment variables
- ✅ **Static Generation + ISR** - Fast page loads with on-demand revalidation
- ✅ **Markdown Editor** - Rich editing experience with preview
- ✅ **Contact Form** - Submissions stored as GitHub issues
- ✅ **Free Tier Compliant** - Runs entirely on free tiers (Vercel + GitHub)

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   Readers   │─────▶│   Next.js    │─────▶│   GitHub    │
│             │      │   (Vercel)   │      │   (Content) │
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Editors    │
                     │  (OAuth)     │
                     └──────────────┘
```

## Prerequisites

1. **GitHub Account** - For content storage and authentication
2. **Vercel Account** - For deployment (free tier)
3. **Node.js 18+** - For local development

## Setup Instructions

### 1. Create Content Repository

Create a new GitHub repository for your blog content (e.g., `blog-content`):

```bash
mkdir blog-content
cd blog-content
git init
mkdir -p posts images/banners images/inline
echo "# Blog Content" > README.md
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/blog-content.git
git push -u origin main
```

### 2. Create GitHub App

1. Go to GitHub Settings → Developer settings → GitHub Apps → New GitHub App
2. Fill in:
   - **GitHub App name**: `blog-cms-YOUR_NAME`
   - **Homepage URL**: `http://localhost:3000`
   - **Webhook**: Uncheck "Active"
   - **Repository permissions**:
     - Contents: Read & Write
     - Issues: Read & Write (for contact form)
   - **Where can this GitHub App be installed?**: Only on this account
3. Click "Create GitHub App"
4. Generate a private key and download it
5. Note the **App ID**
6. Install the app on your content repository
7. Note the **Installation ID** from the URL

### 3. Configure Admin Users

Set up your admin credentials in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
ADMIN_NAME=Your Name
ADMIN_EMAIL=your.email@example.com
```

**For multiple admins**, add numbered environment variables:

```env
ADMIN_USERNAME_2=editor
ADMIN_PASSWORD_2=another_secure_password
ADMIN_NAME_2=Editor Name
ADMIN_EMAIL_2=editor@example.com
```

See [ADMIN_USERS.md](./ADMIN_USERS.md) for detailed instructions on managing multiple admins.

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# GitHub App Configuration
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
Your private key here (paste entire content)
-----END RSA PRIVATE KEY-----"
GITHUB_APP_INSTALLATION_ID=12345678

# Content Repository
CONTENT_REPO_OWNER=your_github_username
CONTENT_REPO_NAME=blog-content

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Your Name
ADMIN_EMAIL=your.email@example.com

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_min_32_characters
NEXTAUTH_URL=http://localhost:3000
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

Visit:
- **Blog**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

### 7. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables from `.env.local`
4. Update `NEXTAUTH_URL` to `https://your-domain.vercel.app`
5. Deploy!

**Important**: Make sure to set strong passwords in production environment variables.

## Usage

### Creating a Post

1. Sign in at `/admin`
2. Click "Create New Post"
3. Fill in title, description, author, categories
4. Upload a banner image (optional)
5. Write content in Markdown
6. Click "Save Draft" or "Publish"

### Uploading Images

1. Go to `/admin/media`
2. Upload banner images (1920x1080 max) or inline images (1200x1200 max)
3. Images are automatically converted to WebP
4. Copy the path to use in posts

### Contact Form

Contact form submissions are automatically created as GitHub issues in your content repository with the label `contact-form`.

## Project Structure

```
├── app/
│   ├── (blog)/          # Public blog pages
│   ├── admin/           # Admin interface
│   └── api/             # API routes
├── components/
│   ├── blog/            # Blog components
│   ├── admin/           # Admin components
│   └── contact/         # Contact form
├── lib/
│   ├── github/          # GitHub API client
│   ├── content/         # Content parsing
│   ├── images/          # Image processing
│   └── auth/            # Authentication
├── actions/             # Server actions
└── types/               # TypeScript types
```

## Content Repository Structure

```
blog-content/
├── posts/
│   ├── 2024-01-15-hello-world.md
│   └── 2024-02-20-nextjs-tips.md
└── images/
    ├── banners/
    │   └── hello-world.webp
    └── inline/
        └── diagram-1.webp
```

## Post Frontmatter Format

```yaml
---
title: "Hello World"
slug: "hello-world"
description: "My first blog post"
publishedAt: "2024-01-15T10:00:00Z"
author: "John Doe"
categories: ["intro", "meta"]
banner: "/images/banners/hello-world.webp"
published: true
---

# Your content here
```

## Free Tier Limits

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ 100GB-hours compute/month
- ✅ 6,000 build minutes/month

### GitHub Free Tier
- ✅ 5,000 API requests/hour
- ✅ Unlimited public repos
- ✅ 500MB private repos

## Troubleshooting

### "Missing GitHub App credentials"
- Ensure all environment variables are set correctly
- Check that private key includes `\n` for line breaks

### "Invalid credentials" on login
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`
- Check for typos in environment variables
- Restart dev server after changing `.env.local`

### Can't access admin panel
- Ensure you're logged in at `/admin/login`
- Check browser cookies are enabled
- Verify `NEXTAUTH_SECRET` is set

### Images not loading
- Check that `CONTENT_REPO_OWNER` and `CONTENT_REPO_NAME` are correct
- Verify GitHub App has Contents: Read permission
- Check image paths start with `/`

### Rate limit exceeded
- GitHub API allows 5,000 requests/hour
- Reduce revalidation frequency
- Add caching if needed

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
