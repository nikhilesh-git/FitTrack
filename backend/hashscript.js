const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Nikhilesh@2005'; // choose your password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
}

generateHash();
