const redis = require('redis');
const bluebird = require('bluebird');
const { promisify } = require('util');

// make node_redis promise compatible
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);


const REDIS_PORT = 'redis://127.0.0.1:6379';
const client = redis.createClient(REDIS_PORT);
const setexAsync = promisify(client.setex).bind(client);
const getAsync = promisify(client.get).bind(client);

const setData = (key, time, value) => setexAsync(key, time, value);
const getData = (key) => getAsync(key);

module.exports = { client, setexAsync, setData, getData };