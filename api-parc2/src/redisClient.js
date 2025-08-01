const redis = require('redis');
const client = redis.createClient({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT || 6379
});

client.on('error', (err) => console.log('Redis Client Error', err));

module.exports = client;