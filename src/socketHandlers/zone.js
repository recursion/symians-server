export default function(io, socket){
  /**
   * once the client has loaded the world
   * subscribe them to updates
   */
  socket.on('zone-loaded', ()=> {
    // change this to join the zoneID channel
    console.log('adding socket to zone:1')
    socket.join('zone:1');
  });
}
