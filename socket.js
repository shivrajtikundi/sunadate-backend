const server = require('./server').httServer;


/**
 * @SocketIio Connection Here 
 */
const io = require('socket.io')(server,{
    maxHttpBufferSize:6000000,
    cors: {
        origin: '*',
      }
});


module.exports ={
    // socketio: io
};