import redis from 'redis'
import Promise from 'bluebird'

const client = redis.createClient();
Promise.promisifyAll(redis.RedisClient.prototype);

export default function(io){
  client.subscribe('zoneCreated');
  client.subscribe('create');
  client.subscribe('update');
  client.subscribe('grow');

  client.on('message', (channel, message)=>{
    // TODO: determine which zone/channel to send the message to
    io.to('zone:1').emit(channel, message);
  });
}
