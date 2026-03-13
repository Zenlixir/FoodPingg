const CHECK_INTERVAL = 60 * 1000;

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

function parseDateNotif(dateStr) {
  const parts = dateStr.split('/');
  let year = parseInt(parts[2]);
  if (year < 100) year += 2000;
  return new Date(year, parseInt(parts[1]) - 1, parseInt(parts[0]));
}

function showNotification(foodName, days, date) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const key = `notified_${foodName}_${date}`;
  if (localStorage.getItem(key) === 'true') return;
  localStorage.setItem(key, 'true');

  const msg = days === 0
    ? `${foodName} expired hari ini!`
    : `${foodName} hampir expired (${days} hari lagi)`;

  navigator.serviceWorker.getRegistration().then(reg => {
    if (!reg) return;
    reg.showNotification('FoodPing Alert!', {
      body: msg,
      icon: 'icon.png',
      badge: 'icon.png',
      vibrate: [200, 100, 200],
      tag: key,
      renotify: false
    });
  });
}

function isNotifTime() {
  if (localStorage.getItem('notifEnabled') === 'false') return false;

  const saved = localStorage.getItem('notifTime') || '8:00 AM';
  const parts  = saved.split(/[: ]/);
  let h = parseInt(parts[0]);
  const m = parseInt(parts[1]);
  const a = parts[2];

  if (a === 'PM' && h !== 12) h += 12;
  if (a === 'AM' && h === 12) h = 0;

  const now = new Date();
  return now.getHours() === h && now.getMinutes() === m;
}

function checkFoodExpiry() {
  if (!isNotifTime()) return;

  const foods = JSON.parse(localStorage.getItem('foods')) || [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  foods.forEach(food => {
    const diffDays = Math.ceil((parseDateNotif(food.date) - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3 && diffDays >= 0) {
      showNotification(food.name, diffDays, food.date);
    }
  });
}

checkFoodExpiry();
setInterval(checkFoodExpiry, CHECK_INTERVAL);