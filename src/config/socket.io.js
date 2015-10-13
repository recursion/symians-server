import http from 'http'
import socketio from 'socket.io'
import socketServices from '../sockets'
import Zone from '../zone.js'

const port = process.env.PORT || 3000;
const world = new Zone(128, 128);

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

    console.log('A user connected');

    /**
     * send the full world for the initial connection
     */
    socket.emit('world-init', world);

    /**
     * once the client has loaded the world
     * subscribe them to updates
     */
    socket.on('world-loaded', ()=> {
      socket.join('world-updates');
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
      console.log('A user disconnected');
    });

  });

  // broadcast the entire world data to the client
  // TODO: optimize this in all sorts of ways.
  // we shouldnt really ever need to send the entire map
  // after the initial connection.
  setInterval(()=> {
    io.to('world-updates').emit('world-update', world);
  }, 2000);

  // start listening
  httpServer.listen(port, ()=> {
    console.log('listening on *:' + port);
  });

  // return the socket server
  return io;

}
