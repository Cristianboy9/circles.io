const socket = io();  

const canvas = document.getElementById('canvas');  
const ctx = canvas.getContext('2d');  

const jugador = {  
  x: canvas.width / 2,  
  y: canvas.height / 2,  
  tamaño: 10,  
  color: 'rgb(255, 0, 0)',  
  velocidad: 5,  
  nombre: 'Jugador'  
};  

let teclasPresionadas = {};  

document.addEventListener('keydown', (event) => {  
  teclasPresionadas[event.key] = true;  
});  

document.addEventListener('keyup', (event) => {  
  teclasPresionadas[event.key] = false;  
});  

function actualizarJugador() {  
  if (teclasPresionadas['ArrowUp']) {  
    jugador.y -= jugador.velocidad;  
  }  
  if (teclasPresionadas['ArrowDown']) {  
    jugador.y += jugador.velocidad;  
  }  
  if (teclasPresionadas['ArrowLeft']) {  
    jugador.x -= jugador.velocidad;  
  }  
  if (teclasPresionadas['ArrowRight']) {  
    jugador.x += jugador.velocidad;  
  }  

  if (jugador.x < 0) {  
    jugador.x = canvas.width;  
  }  
  if (jugador.x > canvas.width) {  
    jugador.x = 0;  
  }  
  if (jugador.y < 0) {  
    jugador.y = canvas.height;  
  }  
  if (jugador.y > canvas.height) {  
    jugador.y = 0;  
  }  

  socket.emit('actualizar jugador', jugador);  
}  

setInterval(actualizarJugador, 16);  

socket.on('actualizar jugadores', (jugadores) => {  
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
  for (const jugador of jugadores) {  
    ctx.fillStyle = jugador.color;  
    ctx.beginPath();  
    ctx.arc(jugador.x, jugador.y, jugador.tamaño, 0, Math.PI * 2);  
    ctx.fill();  
    ctx.font = '12px Arial';  
    ctx.textAlign = 'center';  
    ctx.textBaseline = 'middle';  
    ctx.fillStyle = 'rgb(0, 0, 0)';  
    ctx.fillText(jugador.nombre, jugador.x, jugador.y);  
  }  
});
