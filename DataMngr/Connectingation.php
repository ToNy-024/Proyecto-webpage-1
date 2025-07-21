<?php
header("Content-Type: application/json; charset=UTF-8");
function connectarDaseBatos(){
$HostDB = "localhost";
$UsuarioDB = "root";
$DaseBatosNombre = "ranking";
$contraseya = '';
try{
$pdo = new pdo("mysql:host=$HostDB; dbname=$DaseBatosNombre;charset=UTF8", $UsuarioDB ,$contraseya);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
return $pdo;
} catch (PDOException $e) {
    die( "Error de conexión: " . $e->getMessage());
}
}
//Aqui termina lo de la coneccion, abajo debería salir el resto de las funciones, hasta que me ponga fancy y las mande para otras carpetas

//lo de aca deberia ser para hacer queries
function obtenerLeaderboard(){
$ConX = connectarDaseBatos();
$query = "SELECT * FROM leaderboarding ORDER BY tiempo DESC LIMIT 15 ";
$stmt = $ConX->prepare($query);
$stmt->execute();
$resultado = $stmt->fetchall(PDO::FETCH_ASSOC);
return $resultado;
}
function obteneraccion(){
    if ($_SERVER["REQUEST_METHOD"] == "POST"){
        $contenido = file_get_contents("php://input");
        $datos = json_decode($contenido, true);
        $accion = $datos["accion"] ?? null;
        $usid = $datos["usid"] ?? null;
        $query = "SELECT * FROM leaderboarding WHERE usid = ?";
        $ConX = connectarDaseBatos();
        $stmt = $ConX->prepare($query);
        $stmt->execute([$usid]);
        $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
        switch ($accion) {
            case "listar":
                echo json_encode(obtenerLeaderboard());
                break;
            case "crear":
                if (!empty($resultado) && isset($resultado[0]["usid"])) {
                    // Si existe, actualiza en vez de crear
                    return actualizarTiempo($datos);
                } else {
                    return crearLeaderboard($datos);
                }
                break;
            case "actualizar":
                return actualizarTiempo($datos);
                break;
            case "eliminar":
                return eliminarTiempo($datos);
                break;
            default:
                echo "Acción no válida";
        }
    }
}
//Aqui deberia ser la abominacion para insertar datos
function crearLeaderboard($datos){
        $nombre = $datos["nombre"] ?? "Anonimo";
        $usid = $datos["usid"] ?? null;
        $tiempo = intval($datos["tiempo"] ?? 0);
        $imagen = $datos["imagen"] ?? null;
        if (isset($usid)) {
            $ConX = connectarDaseBatos();
            $query = "INSERT INTO leaderboarding (nombre, usid, tiempo, imagen) VALUES (?, ?, ?, ?)";
            $stmt = $ConX->prepare($query);
            $resultado = $stmt->execute([$nombre, $usid, $tiempo, $imagen]);
            
        }
        if($resultado){
            echo "Datos insertados correctamente";
            return $resultado;
        } else{
            echo "Error al insertar los datos";
        }
    }

function obtenerTiempo($usid){
        if (isset($usid)) {
            $ConX = connectarDaseBatos();
            $query = "SELECT tiempo FROM leaderboarding WHERE usid = ?";
            $stmt = $ConX->prepare($query);
            $stmt->execute([$usid]);
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $resultado;
        }
    }
    

function actualizarTiempo($datos) {
        $usid = $datos["usid"] ?? null;
        $tiempo = intval($datos["tiempo"] ?? 0);
        $tiempoAntiguo = obtenerTiempo($usid);
        $tiempoAntiguo = $tiempoAntiguo[0]["tiempo"] ?? 0;
        $tiempo = $tiempoAntiguo > $tiempo ? $tiempoAntiguo : $tiempo;
    
    if (isset($usid) && isset($tiempo)) {
        $ConX = connectarDaseBatos();
        $query = "UPDATE leaderboarding SET tiempo = ? WHERE usid = ?";
        $stmt = $ConX->prepare($query);
        $resultado = $stmt->execute([$tiempo, $usid]);
        
    }
    if($resultado){
            echo "Datos actualizados correctamente";
            return $resultado;
        } else{
            echo "Error al actualizar los datos";
        }
    }

function eliminarTiempo($datos) {
        $usid = $datos["usid"] ?? null;
    if (isset($usid)) {
        $ConX = connectarDaseBatos();
        $query = "DELETE FROM leaderboarding WHERE usid = ?";
        $stmt = $ConX->prepare($query);
        $resultado = $stmt->execute([$usid]);
        return $resultado;
    } else {
        echo "Eliminar tiempo no es posible sin cuenta";
    }
}
obteneraccion();
?>