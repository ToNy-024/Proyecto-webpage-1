const butt = document.getElementById("butt");
let velocityX = 0,
  velocityY = 0;
let posX = window.innerWidth / 2,
  posY = window.innerHeight / 2;
const Velocidad = 0.6; // Constante que determina la velodcidad
let btnCheck = false;
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  if (btnCheck) return;
  mouseX = event.clientX;
  mouseY = event.clientY;
  const dx = posX - mouseX;
  const dy = posY - mouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 250) {
    const angle = Math.atan2(dy, dx);
    const force = (250 - distance) / 250; // Va de 1 a 0
    velocityX += Math.cos(angle) * force * 20;
    velocityY += Math.sin(angle) * force * 20;
  }
});

function border() {
  btnCheck = true;
  posX = window.innerWidth / 2;
  posY = window.innerHeight / 2;
  velocityX = 0;
  velocityY = 0;
  butt.style.left = `${posX}px`;
  butt.style.top = `${posY}px`;
  setTimeout(() => {
    btnCheck = false;
  }, 200); // Evita que el botón salga volando otra vez
}
function clicked() {
  alert(
    "3　神说：「要有光」，就有了光。 4　神看光是好的，就把光暗分开了。 5　神称光为「昼」，称暗为「夜」。有晚上，有早晨，这是头一日。"
  );
  border();
}
function mover(lado) {
  const wrap = document.getElementById("wrapperation");
  wrap.className = "";
  if (lado === "Izq") wrap.classList.add("mo-Izq");
  if (lado === "Der") wrap.classList.add("mo-Der");
  if (lado === "Arr") wrap.classList.add("mo-Arr");
  if (lado === "Abj") wrap.classList.add("mo-Abj");
  setTimeout(() => {
    wrap.className = "";
  }, 200);
}
function update() {
  if (!btnCheck) {
    velocityX *= Velocidad;
    velocityY *= Velocidad;
    const maxSpeed = 25;
    velocityX = Math.max(-maxSpeed, Math.min(maxSpeed, velocityX));
    velocityY = Math.max(-maxSpeed, Math.min(maxSpeed, velocityY));
    // Calcular la nueva posición sin modificar aún
    const nextX = posX + velocityX;
    const nextY = posY + velocityY;
    const Izq = nextX <= 0;
    const Der = nextX >= window.innerWidth - butt.offsetWidth;
    const Arr = nextY <= 0;
    const Abj = nextY >= window.innerHeight - butt.offsetHeight;
    if (Izq || Der || Arr || Abj) {
      border();
      if (Izq) mover("Izq");
      else if (Der) mover("Der");
      else if (Arr) mover("Arr");
      else if (Abj) mover("Abj");
    } else {
      // Si no tocó los bordes, actualizar posición normalmente
      posX = nextX;
      posY = nextY;
      butt.style.left = `${posX}px`;
      butt.style.top = `${posY}px`;
    }
  }
  requestAnimationFrame(update);
}
update();

butt.addEventListener("mouseover", () => {
  mover('Izq');
});