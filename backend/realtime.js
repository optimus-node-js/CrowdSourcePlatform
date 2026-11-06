// Thin wrapper so routes can broadcast events without caring whether Socket.IO is running
// (it is not on serverless hosts).
let io = null;

module.exports = {
  attach(server) {
    io = server;
    io.on('connection', (socket) => {
      socket.on('issue:watch', (id) => socket.join(`issue:${id}`));
      socket.on('issue:unwatch', (id) => socket.leave(`issue:${id}`));
    });
  },
  emit(event, payload, room) {
    if (!io) return;
    if (room) io.to(room).emit(event, payload);
    else io.emit(event, payload);
  },
};
