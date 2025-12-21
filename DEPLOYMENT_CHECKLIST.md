# Pre-Deployment Security Checklist

Complete this checklist before deploying to production or publishing to GitHub.

## ✅ Authentication & Passwords

- [ ] All admin passwords are bcrypt hashes (use `node scripts/hash-password.js`)
- [ ] No plain text passwords in `.env.local`
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
  ```bash
  openssl rand -base64 32
  ```
- [ ] Admin usernames are not default values (change from "admin")
- [ ] All admin accounts have strong passwords (16+ characters, mixed case, numbers, symbols)

## ✅ Environment Variables

- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.local` is NOT committed to Git
- [ ] `.env.local.example` contains NO actual secrets
- [ ] All environment variables are set in Vercel dashboard (for production)
- [ ] GitHub App private key is properly formatted with `\n` for line breaks

## ✅ GitHub Configuration

- [ ] GitHub App has minimum required permissions:
  - [ ] Contents: Read & Write
  - [ ] Issues: Read & Write (if using contact form)
- [ ] GitHub App is installed only on the content repository
- [ ] GitHub account has 2FA enabled
- [ ] Content repository is separate from application repository
- [ ] Repository collaborators are reviewed and limited

## ✅ Code Security

- [ ] No hardcoded secrets in code
- [ ] No API keys or tokens in code
- [ ] Error messages don't expose sensitive information
- [ ] Logs don't contain passwords or tokens
- [ ] All user inputs are validated
- [ ] XSS protection is enabled

## ✅ Dependencies

- [ ] Run `npm audit` and fix vulnerabilities
  ```bash
  npm audit
  npm audit fix
  ```
- [ ] All dependencies are up to date
  ```bash
  npm outdated
  npm update
  ```
- [ ] No known security vulnerabilities in dependencies

## ✅ Security Headers

- [ ] Content Security Policy (CSP) is configured
- [ ] X-Frame-Options is set to DENY
- [ ] X-Content-Type-Options is set to nosniff
- [ ] Referrer-Policy is configured
- [ ] HTTPS is enforced (automatic with Vercel)

## ✅ Testing

- [ ] Test login with correct credentials
- [ ] Test login with incorrect credentials
- [ ] Verify rate limiting works (try 6 failed logins)
- [ ] Test all admin functions (create, edit, delete posts)
- [ ] Test image upload with various file types
- [ ] Test contact form submission
- [ ] Verify GitHub commits are created correctly
- [ ] Test ISR revalidation

## ✅ Monitoring

- [ ] Set up error monitoring (e.g., Sentry, LogRocket)
- [ ] Configure alerts for failed login attempts
- [ ] Monitor Vercel function logs
- [ ] Review GitHub commit history regularly

## ✅ Documentation

- [ ] README.md is up to date
- [ ] SECURITY.md is included
- [ ] Setup instructions are clear
- [ ] Security best practices are documented
- [ ] Contact information for security issues is provided

## ✅ Git Repository

- [ ] `.gitignore` includes all sensitive files
- [ ] No `.env.local` in Git history
  ```bash
  git log --all --full-history -- .env.local
  ```
- [ ] No secrets in commit messages
- [ ] Repository is ready for public access (if publishing publicly)

## ✅ Vercel Deployment

- [ ] Environment variables are set in Vercel dashboard
- [ ] Production domain is configured
- [ ] HTTPS is enabled (automatic)
- [ ] Function timeout is appropriate (default 10s)
- [ ] Build settings are correct

## ✅ Final Checks

- [ ] All checklist items above are completed
- [ ] Security policy is reviewed
- [ ] Backup of environment variables is stored securely (password manager)
- [ ] Team members know how to access admin panel
- [ ] Incident response plan is in place

## 🚀 Deployment Commands

```bash
# 1. Install dependencies
npm install

# 2. Generate password hashes
node scripts/hash-password.js your_secure_password

# 3. Update .env.local with hashed passwords

# 4. Test locally
npm run dev

# 5. Build for production
npm run build

# 6. Deploy to Vercel
git push
# Or use Vercel CLI: vercel --prod
```

## 📝 Post-Deployment

After deployment:

- [ ] Test production site thoroughly
- [ ] Verify all environment variables are working
- [ ] Test admin login on production
- [ ] Create a test post and verify it appears
- [ ] Test contact form on production
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring

## 🔒 Security Maintenance

Regular tasks:

- **Weekly**: Review failed login attempts in logs
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Rotate admin passwords
- **Annually**: Review and update security policy

---

**Last Updated**: [Add date when completing checklist]
**Reviewed By**: [Your name]
**Deployment Date**: [Add deployment date]
