const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config({path:'./config.env'})

console.log("process.env.REDIS_HOST",process.env.REDIS_HOST);

const redisClient = redis.createClient({ 
    host : process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})
redisClient.connect();
module.exports = redisClient
