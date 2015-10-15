import express from './config/express'
import io from './config/socket.io'

/*
import redis from 'redis'
let rClient = redis.createClient();
rClient.hgetall('Mob:1', (err, mob) => {
  console.log(mob);
  rClient.end();
});
*/

import caminte from 'caminte'
let Schema = caminte.Schema;
let config = {
  driver: 'redis',
  password: '',
  host: 'localhost',
  port: '6379'
};
let schema = new Schema(config.driver, config);
let Mob = schema.define('Mob', {
  x: {type: Number, default: 0},
  y: {type: Number, default: 0},
  health: {type: Number, default: 100},
  fatigue: {type: Number, default: 0},
  hunger: {type: Number, default: 0},
  name: String,
  state: {type: String, default: 'idle'}
});

Mob.prototype.speak = ()=>{
  console.log(this.health);
};

Mob.find({where: {id: 1}}, (err, mobs)=>{
  console.log(mobs);
});

let app = express();

app = io(app);
