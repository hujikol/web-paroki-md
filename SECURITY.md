# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

This blog CMS implements the following security measures:

### Authentication & Authorization
- ✅ Bcrypt password hashing (cost factor: 10)
- ✅ Rate limiting on login attempts (5 attempts per 15 minutes)
- ✅ Session timeout (24 hours)
- ✅ JWT-based session management
- ✅ Protected admin routes via middleware

### Input Validation & Sanitization
- ✅ Zod schema validation for all user inputs
- ✅ Length limits on all text fields
- ✅ XSS prevention in markdown rendering
- ✅ Script tag and JavaScript protocol removal
- ✅ Email format validation
- ✅ Slug sanitization

### Security Headers
- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options (clickjacking protection)
- ✅ X-Content-Type-Options (MIME sniffing prevention)
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### Data Protection
- ✅ Environment variables for secrets
- ✅ No sensitive data in Git repository
- ✅ GitHub App authentication for API access
- ✅ HTTPS enforcement (via Vercel)

### Image Upload Security
- ✅ File type validation (images only)
- ✅ File size limits (10MB max)
- ✅ Safe filename generation
- ✅ Server-side image processing

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email the maintainer directly at [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

You should receive a response within 48 hours. If the vulnerability is confirmed, we will:

1. Work on a fix immediately
2. Release a security patch
3. Credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices for Deployment

### Environment Variables
- ✅ Use strong, randomly generated passwords (min 16 characters)
- ✅ Use bcrypt hashes for all passwords (use `node scripts/hash-password.js`)
- ✅ Rotate `NEXTAUTH_SECRET` periodically
- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel environment variables for production

### GitHub Configuration
- ✅ Use a dedicated GitHub App (not personal access tokens)
- ✅ Limit GitHub App permissions to minimum required
- ✅ Enable 2FA on GitHub account
- ✅ Use a separate content repository
- ✅ Review GitHub App installation permissions regularly

### Monitoring
- ✅ Monitor failed login attempts in logs
- ✅ Set up alerts for unusual activity
- ✅ Review GitHub commit history regularly
- ✅ Monitor Vercel function logs

### Updates
- ✅ Keep dependencies up to date
- ✅ Run `npm audit` regularly
- ✅ Subscribe to security advisories for dependencies
- ✅ Test updates in development before deploying

## Known Limitations

1. **No Multi-Factor Authentication (MFA)**: Currently only password-based auth
2. **In-Memory Rate Limiting**: Resets on server restart (consider Redis for production)
3. **No Account Lockout Notification**: Failed attempts are logged but not alerted
4. **No Password Complexity Requirements**: Enforced only by documentation

## Security Checklist for Production

Before deploying to production:

- [ ] All passwords are bcrypt hashes (not plain text)
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [ ] GitHub App has minimum required permissions
- [ ] Environment variables are set in Vercel (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enforced (automatic with Vercel)
- [ ] Content Security Policy is configured
- [ ] Dependencies are up to date (`npm audit`)
- [ ] Error messages don't expose sensitive information
- [ ] Logs don't contain passwords or tokens

## Compliance

This application is designed to comply with:

- ✅ OWASP Top 10 (2021)
- ✅ GDPR (no personal data collection beyond admin emails)
- ✅ General security best practices

## License

This security policy is part of the Blog CMS project and is licensed under the same terms.
