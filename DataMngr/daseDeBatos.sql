
CREATE DATABASE IF NOT EXISTS ranking;
USE ranking;

CREATE TABLE leaderboarding(
id INT AUTO_INCREMENT PRIMARY KEY,
nombre varchar(69) NOT NULL,
tiempo INT NOT NULL,
usid varchar(255) NOT NULL,
imagen varchar(255) NOT NULL
);
-- esto seria el esquema de la tabla, sin datos
-- id es el id de la tabla, auto incrementable
-- nombre es el nombre del jugador
-- tiempo es el tiempo que ha perdido
-- usid es el id del usuario, que se obtiene de la API que ocupo
-- imagen es la imagen del jugador, que se obtiene de la API que ocupo