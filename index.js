const socket = io();  
const canvas = document.getElementById('juego');  
const ctx = canvas.getContext('2d');  
const ancho = 2000; // Tamaño del mapa en x  
const alto = 2000; // Tamaño del mapa en y  
const pantallaAncho = 800; // Tamaño de la pantalla en x  
const pantallaAlto = 600; // Tamaño de la pantalla en y  
const tileTamano = 50; // Tamaño de cada tile en el mapa  
const tiles = []; // Array de tiles del mapa  

let jugador = {  
  x: ancho / 2,  
  y: alto / 2,  
  tamaño: 5,  
  color: 'rgb(255, 255, 255)',  
  nombre: ''  
};  

let bolas = [];  
let otrosJugadores = {};  

// Inicializar array de tiles  
for (let i = 0; i < ancho / tileTamano; i++) {  
  tiles[i] = [];  
  for (let j = 0; j < alto / tileTamano; j++) {  
    // Agregar paredes al mapa  
    if (i === 0 || j === 0 || i === ancho / tileTamano - 1 || j === alto / tileTamano - 1) {  
      tiles[i][j] = 1; // Pared  
    } else {  
      tiles[i][j] = 0; // Espacio vacío  
    }  
  }  
}  

socket.on('conectado', (jugadores) => {  
  console.log('Conectado al servidor');  
  otrosJugadores = jugadores;  
});  

socket.on('actualizarJugadores', (jugadores) => {  
  otrosJugadores = jugadores;  
  dibujarJugadores();  
});  

socket.on('enviarBola', (bola) => {  
  bolas.push(bola);  
});  

function crearBola() {  
  const bola = {  
    x: Math.random() * ancho,  
    y: Math.random() * alto,  
    tamaño: 5,  
    color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`  
  };  
  socket.emit('enviarBola', bola);  
  bolas.push(bola);  
}  

function dibujarBolas() {  
  ctx.fillStyle = 'rgb(0, 0, 0)';  
  ctx.fillRect(0, 0, pantallaAncho, pantallaAlto);  
  bolas.forEach((bola) => {  
    const x = bola.x - jugador.x + pantallaAncho / 2;  
    const y = bola.y - jugador.y + pantallaAlto / 2;  
    if (x > 0 && x < pantallaAncho && y > 0 && y < pantallaAlto) {  
      ctx.fillStyle = bola.color;  
      ctx.beginPath();  
      ctx.arc(x, y, bola.tamaño, 0, Math.PI * 2);  
      ctx.fill();  
    }  
  });  
}  

function dibujarJugadores() {  
  ctx.fillStyle = 'rgb(0, 0, 0)';  
  ctx.fillRect(0, 0, pantallaAncho, pantallaAlto);  
  // Dibujar jugador  
  ctx.fillStyle = jugador.color;  
  ctx.beginPath();  
  ctx.arc(pantallaAncho / 2, pantallaAlto / 2, jugador.tamaño, 0, Math.PI * 2);  
  ctx.fill();  
  // Dibujar otros jugadores  
  Object.keys(otrosJugadores).forEach((idJugador) => {  
    const otroJugador = otrosJugadores[idJugador];  
    const x = otroJugador.x - jugador.x + pantallaAncho / 2;  
    const y = otroJugador.y - jugador.y + pantallaAlto / 2;  
    if (x > 0 && x < pantallaAncho && y > 0 && y < pantallaAlto) {  
      ctx.fillStyle = otroJugador.color;  
      ctx.beginPath();  
      ctx.arc(x, y, otroJugador.tamaño, 0, Math.PI * 2);  
      ctx.fill();  
    }  
  });  
  // Dibujar tiles del mapa  
  const tileX = Math.floor(jugador.x / tileTamano);  
  const tileY = Math.floor(jugador.y / tileTamano);  
  for (let i = -2; i <= 2; i++) {  
    for (let j = -2; j <= 2; j++) {  
      const tile = tiles[tileX + i][tileY + j];  
      if (tile === 1) {  
        ctx.fillStyle = 'rgb(255, 0, 0)';  
        ctx.fillRect((i + 2) * tileTamano - pantallaAncho / 2 + jugador.x, (j + 2) * tileTamano - pantallaAlto / 2 + jugador.y, tileTamano, tileTamano);  
      }  
    }  
  }  
}  

function actualizarJugador() {  
  // Actualizar posición del jugador  
  if (event.key === 'ArrowUp') {  
    const tileY = Math.floor(jugador.y / tileTamano);  
    const tileX = Math.floor(jugador.x / tileTamano);  
    if (tiles[tileX][tileY - 1] === 0) {  
      jugador.y -= 5;  
    }  
  } else if (event.key === 'ArrowDown') {  
    const tileY = Math.floor(jugador.y / tileTamano);  
    const tileX = Math.floor(jugador.x / tileTamano);  
    if (tiles[tileX][tileY + 1] === 0) {  
      jugador.y += 5;  
    }  
  } else if (event.key === 'ArrowLeft') {  
    const tileX = Math.floor(jugador.x / tileTamano);  
    const tileY = Math.floor(jugador.y / tileTamano);  
    if (tiles[tileX - 1][tileY] === 0) {  
      jugador.x -= 5;  
    }  
  } else if (event.key === 'ArrowRight') {  
    const tileX = Math.floor(jugador.x / tileTamano);  
    const tileY = Math.floor(jugador.y / tileTamano);  
    if (tiles[tileX + 1][tileY] === 0) {  
      jugador.x += 5;  
    }  
  }  
  // Verificar si el jugador come una bola  
  bolas.forEach((bola, indice) => {  
    const x = bola.x - jugador.x + pantallaAncho / 2;  
    const y = bola.y - jugador.y + pantallaAlto / 2;  
    if (Math.sqrt((x - pantallaAncho / 2) ** 2 + (y - pantallaAlto / 2) ** 2) < jugador.tamaño + bola.tamaño) {  
      // El jugador come la bola y crece  
      jugador.tamaño += bola.tamaño;  
      bolas.splice(indice, 1);  
    }  
  });  
  socket.emit('actualizarJugador', jugador);  
}  

function crearMenu() {  
  const menu = document.createElement('div');  
  menu.innerHTML = `  
    <input type="text" id="nombre" placeholder="Ingrese su nombre">  
    <button id="conectar">Conectar</button>  
  `;  
  document.body.appendChild(menu);  
}  

function iniciarJuego() {  
  crearMenu();  
  document.getElementById('conectar').addEventListener('click', () => {  
    jugador.nombre = document.getElementById('nombre').value;  
    socket.emit('conectar', jugador);  
  });  
  canvas.addEventListener('keydown', actualizarJugador);  
  setInterval(dibujarJugadores, 16);  
  crearBola();  
}  

iniciarJuego();
