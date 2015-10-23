import http from 'http'
import socketio from 'socket.io'
import socketServices from '../socketHandlers'
import winston from 'winston'
import {setup as setupZone} from '../zones'
import updatesHandler from '../updatesHandler'


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

  updatesHandler(io);

  // socket event handlers
  io.on('connection', (socket)=> {

    winston.info('A user connected');
    socket.join('zone:1');

    /**
     * send the zone for the initial connection
     * @todo: determine which zone this socket
     * should connect to.
     */
    //setupZone(socket);

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
