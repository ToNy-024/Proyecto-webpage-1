const butt = document.getElementById("butt");
    const tipoUsuario = navigator.userAgent.toLowerCase();
    const Alerting = document.querySelector(".Alerteration");
    let velocityX = 0,
    velocityY = 0;
    let posX = window.innerWidth / 2,
    posY = window.innerHeight / 2;
    const Velocidad = 0.6; // Constante que determina la velodcidad
    let btnCheck = false;
    let mouseX = 0;
    let mouseY = 0;

  if (tipoUsuario.includes("android") || tipoUsuario.includes("mobile") || tipoUsuario.includes("ios")) {
    //Aqui puse una condicional para revisar si el usuario está en movil, se comprobará si esta bienpor el numeroso equipo de QA (yo) cuando se despliegue la página
    butt.classlist.add("hidden");
    Alerting.classlist.add("shown");
  }

  document.addEventListener("mousemove", (event) => {
    if (btnCheck) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
    const dx = posX - mouseX;
    const dy = posY - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      const angle = Math.atan2(dy, dx);
      const force = (0 - distance) / 125; // Va de 1 a 0
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
    // Calcular el centro del botón
    const buttCenterX = posX + butt.offsetWidth / 2;
    const buttCenterY = posY + butt.offsetHeight / 2;
    // Drift: el botón se mueve suavemente hacia la última posición del mouse
    const dx = mouseX - buttCenterX;
    const dy = mouseY - buttCenterY;
    // Si el mouse está lejos, el drift es más fuerte
    velocityX += dx * 0.02;
    velocityY += dy * 0.02;

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

// Mejor tiempo (en segundos)
let mejorTiempo = parseInt(localStorage.getItem("mejorTiempo")) || 0;

let intervaloTiempo = null;

// Actualizar tiempo solo si el menú no está abierto
function iniciarTemporizador() {
  if (intervaloTiempo) clearInterval(intervaloTiempo);
  intervaloTiempo = setInterval(() => {
    // Solo actualiza si el popup NO está visible
    if (document.getElementById("popupMejorTiempo").classList.contains("hidden")) {
      tiempo++;
      localStorage.setItem('tiempoRobado', tiempo);
      actualizarTiempo();
    }
  }, 1000);
}

// Llama a esto al cargar la página y al cerrar el popup
iniciarTemporizador();

// Mostrar pop-up y ocultar botón
function mostrarPopupMejorTiempo() {
  document.getElementById("mejorTiempoValor").innerText = tiempoPerdido.innerText.trim();
  document.getElementById("popupMejorTiempo").classList.remove("hidden");
  butt.style.visibility = "hidden"; // Oculta el botón
  // El temporizador se pausa automáticamente porque el setInterval no suma mientras el popup está visible
}

// Guardar mejor tiempo
function guardarMejorTiempo() {
  mejorTiempo = tiempo;
  localStorage.setItem("mejorTiempo", mejorTiempo);
  cerrarPopup();
  alert("¡Mejor tiempo guardado!");
}

// Cerrar pop-up y mostrar botón
function cerrarPopup() {
  document.getElementById("popupMejorTiempo").classList.add("hidden");
  butt.style.visibility = "visible"; // Muestra el botón
  // Reiniciar tiempo y posición
  tiempo = 0;
  actualizarTiempo();
  border();
  iniciarTemporizador(); // Reanuda el temporizador
}

// Detectar si es mejor tiempo al perder (cuando el mouse toca el botón)
butt.addEventListener("mouseover", () => {
  if (tiempo > mejorTiempo) {
    mostrarPopupMejorTiempo();
  } else {
    tiempo = 0;
    localStorage.setItem('tiempoRobado', "0");
    actualizarTiempo();
  }
});

// Detectar si el mouse sale de la ventana
window.addEventListener("mouseout", function(e) {
  // Solo si realmente sale de la ventana, no solo de un elemento
  if (
    e.relatedTarget === null &&
    (e.clientY <= 0 || e.clientY >= window.innerHeight || e.clientX <= 0 || e.clientX >= window.innerWidth)
  ) {
    mostrarPopupMejorTiempo();
  }
});

const tiempoPerdido = document.getElementById("tiempoRobado");
let tiempoGuardado = localStorage.getItem("tiempoRobado");
let tiempo = parseInt(tiempoGuardado);
if (isNaN(tiempo)){ // Arreglado NaN
   tiempo = 0;
}

function actualizarTiempo() {
 
  const horas = String(Math.floor(tiempo / 3600)).padStart(2, "0");
  const minutos = String(Math.floor((tiempo % 3600) / 60)).padStart(2, "0");
  const segundos = String(tiempo % 60).padStart(2, "0");
  tiempoPerdido.innerText = ` ${horas}:${minutos}:${segundos}`;
  localStorage.setItem('tiempoRobado', tiempo);
}

actualizarTiempo(); // Cargar al momento que carga la página

function selectTheme(){
	let Valoration = document.getElementById("Theme").value;  
	pageChanger(Valoration);
}
function loadTheme(){
  const Themation = localStorage.getItem("Theme");
  if (Themation !== null){
    document.getElementById("Theme").value = Themation;
    pageChanger(Themation);
  }
}
function pageChanger(t){
  //Me fije que podia hacer esta funcion, que anteriormente estaba copiada dos veces, haciendo una funcion orientada a objeto, asi no tengo que escribir lo mismo dos veces
  switch(t){
		case "0":
			document.body.classList.remove("bDarkMode","burpleMode","bLizardMode");
      localStorage.setItem("Theme", "0");
			break;
		case "1":
      document.body.classList.remove("burpleMode","bLizardMode");
			document.body.classList.add("bDarkMode");
      localStorage.setItem("Theme", "1");
			break;
		case "2":
      document.body.classList.remove("bDarkMode","bLizardMode");
			document.body.classList.add("burpleMode");
      localStorage.setItem("Theme", "2");
			break;
    case "3":
      document.body.classList.remove("burpleMode","bDarkMode");
      document.body.classList.add("bLizardMode");
      localStorage.setItem("Theme", "3");
      break; 
	}
}
/*
    aqui ocupo la api de firebase para no tener que guardar datos de usuario yo
    asi ocupo API y base de datos, matando dos pajaros de un tiro
*/

// Inicialización de Firebase
const firebaseConfig = {
    apiKey: " ",
    authDomain: "timeisnotgold.firebaseapp.com",
    projectId: "timeisnotgold",
    storageBucket: "timeisnotgold.firebasestorage.app",
    messagingSenderId: "914667655229",
    appId: "1:914667655229:web:dc760f5723ece5174d1a54"
};
firebase.initializeApp(firebaseConfig);
  
   async function gluglu() {
    //esto realiza la autenticacion con google, mediante la api de firebase
    //se supone que el boton de iniciar sesion esta implementado, falta pulirlo
    /* Esto lo implemento mas adelante, por ahora nomas voy a poner una alerta de Work in Progress
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      const user = result.user;
      const userId = user.uid;
      const name = user.displayName;
      const img = user.photoURL;
      const tiempoGuardado = parseInt(localStorage.getItem("tiempoGuardado"));
      localStorage.setItem("Logged", "True");

      // esto deberia enviar los datos al backend
      
      fetch("/Proyecto-webpage-1/DataMngr/Connectingation.php", {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ usid: userId, nombre: name , imagen: img, tiempo: tiempoRobado, accion: "crear" })
      })
      .then((response) => {
        console.log("status: ",response.status);
        if (!response.ok) {
          throw new Error(`status: ${response.status}`);
        }
        
    })
    .then(response => response.text())
    .then(text => console.log("Respuesta del servidor:", text)) 
      .catch((error) => console.error("Error:", error));
      alert("Ingresado como: " + name);
    } catch (error) {
      console.error(error);
      alert("Fallo al ingresar: "+ error);
    }*/
   alert("Work in Progress, no se ha implementado el leaderboard aquí, pero si en perder el tiempo");
  }
    async function cargarLeaderboard() {
      try {
        const response = await fetch("/Proyecto-webpage-1/DataMngr/Connectingation.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accion: "listar" })
        });
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status}`);
        }
        const leaderboard = await response.json();
        console.log("Cargando leaderboard: ", leaderboard);
        ranking(leaderboard);

      } catch (error) {
        console.error("Algo salió mal: ", error);
      }
    }
    function ranking(datos){
      const tbody = document.querySelector("#ranking tbody")
      tbody.innerHTML = ""; 
      datos.forEach((user, index) => {
        const trow = document.createElement("tr");
        trow.innerHTML = `
          <tr>
            <td>${index + 1}</td>
            <td>${user.nombre}</td>
            <td>${user.tiempo}</td>
            <td><img src="${user.imagen}" class=".pfp" alt="Imagen de ${user.nombre}" /></td>
          </tr>
        `;
        tbody.appendChild(trow);
    });
  }
cargarLeaderboard();
loadTheme();