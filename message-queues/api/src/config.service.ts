export function config() {
  const redisHost = process.env.REDIS ?? 'localhost';
  const redisPort = process.env.REDIS_PORT
    ? Number(process.env.REDIS_PORT)
    : 20010;

  console.log(`redisHost: ${redisHost}, redisPort: ${redisPort}`);

  return {
    redisHost,
    redisPort,
    queueName: 'worker',
  };
}
