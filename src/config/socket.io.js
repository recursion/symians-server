import http from 'http'
import socketio from 'socket.io'
import socketServices from '../sockets'
import winston from 'winston'
import {loader} from 'symians-models'

const world = {};
world.zone = {};

let ready = false;
let length = 0;

/**
 * copy data from one object
 *  onto our world.zone
 */
function setZone(z){
  world.zone.height = z.height;
  world.zone.width = z.width;
  world.zone.locations = z.locations.slice();
}

/**
 * inflate the existing zone
 */
loader.inflateZone(1)
  .then(function(z){
    console.log(z.locations.length);
    length = z.locations.length;
    setZone(z);
    ready = true;
  })
  .catch((err)=>{
    throw new Error(err);
  });

const port = process.env.PORT || 3000;

/**
 * setup the socket.io server
 * @param {ExpressInstance} app - The express server instance
 */
export default function (app){

  // create an http server wrapped around express
  const httpServer = http.Server(app);

  // create a socket.io server wrapped around the httpServer
  const io = socketio(httpServer);

  // socket event handlers
  io.on('connection', (socket)=> {

    winston.info('A user connected');

    /**
     * send the full world for the initial connection
     */
    socket.emit('zone-init', world.zone);

    /**
     * once the client has loaded the world
     * subscribe them to updates
     */
    socket.on('zone-loaded', ()=> {
      // change this to join the zoneID channel
      socket.join('zone-updates');
    });

    /**
     * iterate through all socket services
     * pass them io, and this socket
     * (socket services are modules inside the sockets directory)
     */
    for(let service in socketServices){
      if(socketServices.hasOwnProperty(service)){
        socketServices[service](io, socket);
      }
    }

    socket.on('disconnect', ()=> {
      winston.info('A user disconnected');
    });

  });

  // broadcast the entire world data to the client
  // TODO: optimize this in all sorts of ways.
  // we shouldnt really ever need to send the entire map
  // after the initial connection.

  /* dont need right now
  setInterval(()=> {
    io.to('world-updates').emit('world-update', world);
  }, 10000);
  */

  // start listening
  httpServer.listen(port, ()=> {
    winston.info('listening on *:' + port);
  });

  // return the socket server
  return io;

}
