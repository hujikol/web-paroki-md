#!/usr/bin/env node

/**
 * Password Hash Generator for Blog CMS
 * 
 * Usage: node scripts/hash-password.js <password>
 * 
 * This script generates a bcrypt hash for a password.
 * Use the output as the value for ADMIN_PASSWORD in .env.local
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

if (password.length < 8) {
  console.error('⚠️  Warning: Password should be at least 8 characters long');
}

// Generate hash with cost factor of 10
const hash = bcrypt.hashSync(password, 10);

console.log('\n✅ Password hash generated successfully!\n');
console.log('Add this to your .env.local file:\n');
console.log(`ADMIN_PASSWORD="${hash}"\n`);
console.log('Or for additional admins:\n');
console.log(`ADMIN_PASSWORD_2="${hash}"\n`);
