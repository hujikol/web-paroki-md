# Managing Admin Users

This guide explains how to add and manage multiple admin users for your blog CMS.

## Default Admin User

The default admin credentials are set via environment variables:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_secure_password
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
```

## Adding Additional Admins

### Method 1: Environment Variables (Recommended)

Simply add numbered environment variables in `.env.local` - **no code changes needed**:

```env
# First admin (default)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_1
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com

# Second admin
ADMIN_USERNAME_2=editor
ADMIN_PASSWORD_2=secure_password_2
ADMIN_NAME_2=Editor User
ADMIN_EMAIL_2=editor@example.com

# Third admin
ADMIN_USERNAME_3=author
ADMIN_PASSWORD_3=secure_password_3
ADMIN_NAME_3=Author User
ADMIN_EMAIL_3=author@example.com

# Fourth admin (and so on...)
ADMIN_USERNAME_4=contributor
ADMIN_PASSWORD_4=secure_password_4
ADMIN_NAME_4=Contributor User
ADMIN_EMAIL_4=contributor@example.com
```

The system automatically detects and loads all admin users from environment variables. You can add as many as you need by incrementing the number suffix (_2, _3, _4, etc.).

**That's it!** Restart your dev server and all admins will be available.

### Method 2: Database (For production with many admins)

For production with many admins, consider using a database:

1. Install Prisma or similar ORM
2. Create a `users` table with hashed passwords
3. Update the `authorize` function to query the database
4. Use bcrypt to hash passwords:

```typescript
import bcrypt from 'bcryptjs';

async authorize(credentials) {
  const user = await prisma.user.findUnique({
    where: { username: credentials.username }
  });
  
  if (!user) return null;
  
  const isValid = await bcrypt.compare(
    credentials.password,
    user.hashedPassword
  );
  
  if (!isValid) return null;
  
  return { id: user.id, name: user.name, email: user.email };
}
```

## Security Best Practices

### 1. Use Strong Passwords

Generate secure passwords:
```bash
# Linux/Mac
openssl rand -base64 32

# Or use a password manager
```

### 2. Hash Passwords (Production)

Install bcrypt:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Update `lib/auth/nextauth.config.ts`:
```typescript
import bcrypt from 'bcryptjs';

// Hash passwords (do this once, store the hash)
const hashedPassword = await bcrypt.hash('your_password', 10);

// In authorize function
const isValid = await bcrypt.compare(
  credentials.password,
  user.hashedPassword
);
```

### 3. Environment Variables in Vercel

When deploying to Vercel:

1. Go to Project Settings → Environment Variables
2. Add each admin credential:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - (Repeat for additional admins with _2, _3 suffixes)
3. Redeploy

### 4. Rotate Passwords Regularly

Change passwords periodically by updating environment variables and redeploying.

## Removing Admin Access

To remove an admin:

1. Delete their environment variables from `.env.local` (or Vercel settings)
2. Restart the application (or redeploy)

**That's it!** No code changes required.

## Login URL

Admins can log in at:
- Local: `http://localhost:3000/admin/login`
- Production: `https://your-domain.vercel.app/admin/login`

## Troubleshooting

### "Invalid credentials" error
- Check username and password are correct
- Verify environment variables are set in `.env.local`
- Check for typos
- Restart dev server after changing `.env.local`

### Can't access admin panel
- Ensure you're logged in at `/admin/login`
- Check middleware is protecting `/admin/*` routes
- Verify session is working (check browser cookies)

### New admin not appearing
- Verify environment variables follow the naming pattern: `ADMIN_USERNAME_2`, `ADMIN_PASSWORD_2`, etc.
- Ensure both username AND password are set (both required)
- Restart dev server after adding new admin
- Check server console for the warning message showing loaded admins
