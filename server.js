const express = require('express');  
const app = express();  
const server = require('http').createServer(app);  
const io = require('socket.io')(server);  

let jugadores = {};  

io.on('connection', (socket) => {  
  console.log('Nuevo jugador conectado');  
  socket.on('conectar', (jugador) => {  
    jugadores[socket.id] = jugador;  
    io.emit('conectado', jugadores);  
  });  
  socket.on('actualizarJugador', (jugador) => {  
    jugadores[socket.id] = jugador;  
    io.emit('actualizarJugadores', jugadores);  
  });  
  socket.on('enviarBola', (bola) => {  
    io.emit('enviarBola', bola);  
  });  
});  

server.listen(3000, () => {  
  console.log('Servidor iniciado en el puerto 3000');  
});
