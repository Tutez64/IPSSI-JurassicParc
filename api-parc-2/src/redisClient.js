const { createClient } = require('redis');

const redis = createClient({
  url: 'redis://redis:6379'
});

redis.on('error', (err) => console.error('Erreur Redis:', err));
redis.connect();

module.exports = redis;
