let cancion;
let fft;
let reproduciendo = false;
let usarPerlinNoise = false;
let circulos = [];
let particulas = [];
let umbralBeat = 0.2;

function preload() {
  cancion = loadSound("sonido/cancion.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fft = new p5.FFT();
}

function draw() {
  // Perlin noise para variar el color de fondo despues de presionar la barra espaciadora
  if (usarPerlinNoise) {
    let r = noise(frameCount * 0.01) * 100;
    let g = 0;
    let b = 0;
    background(r, g, b);
  } else {
    // Fondo negro antes de presionar la barra espaciadora
    background(0);
  }

  if (reproduciendo) {
    let formaOnda = fft.waveform();
    stroke(255);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < formaOnda.length; i++) {
      let x = map(i, 0, formaOnda.length, 0, width);
      let y = map(formaOnda[i], -1, 1, 0, height);
      vertex(x, y);
    }
    endShape();

    // Analiza el beat y agrega circulos
    let espectro = fft.analyze();
    let amplitudBajo = fft.getEnergy("bass");

    if (amplitudBajo > umbralBeat) {
      let nuevoCirculo = {
        x: random(width),
        y: random(height),
        radio: 50, //
        color: generarColorRojoOscuro(),
      };
      circulos.push(nuevoCirculo);

      // Añade partículas desde el centro hacia afuera
      for (let j = 0; j < 5; j++) {
        let particula = {
          x: nuevoCirculo.x,
          y: nuevoCirculo.y,
          radio: 35,
          color: generarColorRojoOscuro(),
          velocidadX: random(-5, 5),
          velocidadY: random(-5, 5),
        };
        particulas.push(particula);
      }
    }
  }

  // Dibujar y actualizar circulos
  for (let i = circulos.length - 1; i >= 0; i--) {
    let circulo = circulos[i];
    fill(circulo.color);
    noStroke();
    ellipse(circulo.x, circulo.y, circulo.radio * 2);

    // Desvanecer círculo
    circulo.radio -= 1;
    if (circulo.radio <= 0) {
      circulos.splice(i, 1); // Eliminar círculo
    }
  }

  // Dibujar y actualizar partículas
  for (let i = particulas.length - 1; i >= 0; i--) {
    let particula = particulas[i];
    fill(particula.color);
    noStroke();
    ellipse(particula.x, particula.y, particula.radio * 2);

    // Partículas hacia afuera desde el centro
    particula.x += particula.velocidadX;
    particula.y += particula.velocidadY;

    // Desvanecer la particula
    particula.radio -= 0.5;
    if (particula.radio <= 0) {
      particulas.splice(i, 1); // Eliminar particula
    }
  }
}

// Color oscuro de rojo con Perlin noise
function generarColorRojoOscuro() {
  let r = noise(frameCount * 0.01) * 100;
  let g = 0;
  let b = 0;
  return color(r, g, b, 150); // Transparencia
}

// Para cuando se presiona la barra espaciadora
function keyPressed() {
  if (key === " ") {
    toggleReproduccion();
  }
}

function toggleReproduccion() {
  if (!reproduciendo) {
    cancion.play();
  } else {
    cancion.pause();
  }
  reproduciendo = !reproduciendo;
  usarPerlinNoise = reproduciendo;
}
