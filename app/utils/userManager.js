const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
import avatar from '../../public/avatar/defaultAvatar.png';

const DATA_DIR = path.join(process.cwd(), 'data/users');

// Ensure the data directory exists
fs.mkdir(DATA_DIR, { recursive: true }).catch(console.error);

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createUser(username, password) {

  //console.log(DATA_DIR);
  const userFile = path.join(DATA_DIR, `${username}.json`);
  //console.log(userFile);

  const hashedPassword = hashPassword(password);
  
  const userData = {
    username,
    password: hashedPassword,
    avatarURL: avatar,
    cart: [],
    purchases: [],
    loginActivity: [],
    createdAt: new Date().toISOString() 
  };

  await fs.writeFile(userFile, JSON.stringify(userData, null, 2));
}

async function getUser(username) {
  const userFile = path.join(DATA_DIR, `${username}.json`);
  //console.log(userFile);
  try {
    //console.log('reading file');
    const data = await fs.readFile(userFile, 'utf8');
    //console.log(data);
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // User not found
    }
    throw error;
  }
}

async function updateUser(username, updateData) {
  const userFile = path.join(DATA_DIR, `${username}.json`);
  const userData = await getUser(username);
  if (!userData) throw new Error('User not found');

  const updatedUserData = { ...userData, ...updateData };
  await fs.writeFile(userFile, JSON.stringify(updatedUserData, null, 2));
}

async function validateUser(username, password) {
  const user = await getUser(username);
  if (!user) return false;
  return user.password === hashPassword(password);
}

async function addLoginActivity(username, activity) {
  const user = await getUser(username);
  if (!user) throw new Error('User not found');
  
  user.loginActivity.push({
    datetime: new Date().toISOString(),
    type: activity
  });

  await updateUser(username, { loginActivity: user.loginActivity });
}

module.exports = {
  createUser,
  getUser,
  updateUser,
  validateUser,
  addLoginActivity
};