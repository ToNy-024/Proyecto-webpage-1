<?php
function Conectingation(){
$HostDB = "localhost";
$UsuarioDB = "root";
$DaseBatosNombre = "Rankingation";
$contraseya = '';
$ConX = new mysqli_connect("$HostDB","$UsuarioDB","$contraseya","$DaseBatosNombre");
if(!$ConX){
    die("Error: ".$ConX->error());
}
}
//Aqui termina lo de la coneccion, abajo debería salir el resto de las funciones, hasta que me ponga fancy y las mande para otras carpetas

//lo de aca deberia ser para hacer queries
function Queringation(){
Conectingation();
$ConZ = msqli_query($ConX, "SELECT * FROM leaderboarding ORDER BY tiempo");
while ($raya = $ConZ->fetch_assoc()){
echo json_encode($raya);
$ConX->close();
}
}

//Aqui deberia ser la abominacion para insertar datos
function Insertation(){
Conectingation();
$nombreLB = $_POST["nombre"] ?? "Anonimo";
$tiempoLB = intval($_POST["tiempo"]?? 0);
$ConS = msqli_prepare($ConX, "INSERT INTO leaderboarding (nombre, tiempo) VALUES ($nombreLB, $tiempoLB)");
$ConS->bind_param("si", $nombreLB,$tiempoLB);
$ConS->exec();
if ($ConS->affected_rows > 0){
    echo "Datos Guardados!";
}else{
    echo "Error, Sus datos no fueron guardados";
}
$ConS->close();
$ConX->close();
}

?>