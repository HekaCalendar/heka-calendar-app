const now = new Date();
console.log('now:', now.toString());
console.log('now ISO:', now.toISOString());

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yStr = yesterday.toISOString().split('T')[0];
console.log('yesterday local:', yesterday.toString());
console.log('yStr:', yStr);

const yesterdayDate = new Date(now);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;
console.log('yesterdayStr:', yesterdayStr);
console.log('yStr < yesterdayStr:', yStr < yesterdayStr);
console.log('yStr === yesterdayStr:', yStr === yesterdayStr);
