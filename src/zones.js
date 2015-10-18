import winston from 'winston'
import {Zone} from 'symians-lib'
import {loader} from 'symians-models'

let zone;

/**
 * retrieve and inflate a zone by id
 * @param {Number} zoneId - the zone id
 * @param {WebSocket} socket - the socket
 *
 */
function getZone(zoneId=1, socket){
  loader.inflateZone(zoneId)
    .then((z)=>{
      zone = z;
      console.log(z.mobs.length);
      setup(socket);
    })
    .catch((err)=>{
      throw new Error(err);
    });
}

/**
 * get the propert zone data for a given socket
 */
export function setup(socket){
  // determine which zone this socket should connect to
  // for now.. everyone goes to zone 1
  if(zone){
    winston.info('sending zone');
    socket.emit('zone-init', zone);
  } else {
    getZone(1, socket);
  }
}
