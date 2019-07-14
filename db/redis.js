const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

//创建客户端
const redisConn = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);
redisConn.on('error', err => {
    console.log(err);
});

module.exports = redisConn;