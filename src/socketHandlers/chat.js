export default (io, socket) => {

  io.to('chat').emit('chat message', 'You cant see this!');

  socket.join('chat');

  io.to('chat').emit('chat message', 'You can see this!');

  socket.on('chat message', (msg)=> {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', ()=> {
    //console.log('user disconnected');
  });

};

