const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password to hash');
  console.log('Usage: node scripts/hash-password.js <password>');
  process.exit(1);
}

bcrypt.hash(password, 12).then(hash => {
  console.log('\nGenerated Hash for .env.local:');
  console.log('--------------------------------');
  console.log(hash);
  console.log('--------------------------------\n');
});
