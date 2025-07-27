import fs from 'fs';
import path from 'path';

const cookiesFile = path.resolve('cookies.json');

function extractCUser(cookie) {
  const match = cookie.match(/c_user=(\d+)/);
  return match ? match[1] : null;
}

function loadCookies() {
  if (!fs.existsSync(cookiesFile)) return [];
  return JSON.parse(fs.readFileSync(cookiesFile, 'utf8'));
}

function saveCookies(cookies) {
  fs.writeFileSync(cookiesFile, JSON.stringify(cookies, null, 2));
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { link, type, cookie } = req.body;
  if (!link || !type || !cookie) return res.status(400).send('Missing fields');

  const c_user = extractCUser(cookie);
  if (!c_user) return res.status(400).send('Invalid Facebook cookie');

  let cookies = loadCookies();
  if (!cookies.some(c => c.c_user === c_user)) {
    cookies.push({ c_user, cookie });
    saveCookies(cookies);
  }

  console.log(`[VulnSec-Liker] Simulated ${type} to ${link} by user ${c_user}`);
  res.send(`✅ VulnSec-Liker: Simulated ${type} reaction to ${link} using user ${c_user}`);
}
