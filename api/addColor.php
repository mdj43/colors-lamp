<?php
    /*
     * The following lines starting with "require_once" through "$connection"
     * should appear at the top of every PHP file. This ensures the .env is 
     * being used and that a connection to the database is established.
     */
    
    require_once __DIR__ . '/vendor/autoload.php';
    $dotEnv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotEnv->load();

    $inData = json_decode(file_get_contents('php://input'), true);
    $connection = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'],
                             $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    
    if ($connection->connect_error)
    {
        returnWithError($connection->connect_error);
    }
    else
    {
        $statement = $connection->prepare("
            INSERT INTO colors(user_id, name) 
            VALUES(?, ?)
        ");

        $statement->bind_param("ss", $user_id, $color);
        $statement->execute();
        $statement->close();
        $connection->close();

        returnWithError("");
    }

    function returnWithError($error)
    {
        $returnValue = 
        '{
            "error" : "' . $error . '"
        }';
        sendResultInfoAsJson($returnValue);
    }

    function sendResultInfoAsJson($object)
    {
        header('Content-type: application/json');
        echo $object;
    }
?>