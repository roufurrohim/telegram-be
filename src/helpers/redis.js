const redis = require("redis");
const { REDIS_HOSTNAME, REDIS_PORT, REDIS_PASSWORD } = require("./env");

const client = redis.createClient({
  host: REDIS_HOSTNAME,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

client.on("error", (err) => {
  console.log(err);
});

const redisAction = {
  set: (key, value) => {
    client.set(key, value);
  },
};

module.exports = redisAction;
