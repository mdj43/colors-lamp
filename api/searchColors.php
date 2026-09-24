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
        $searchResults = "";
        $searchCount = 0;

        $statement = $connection->prepare("
            SELECT name
            FROM   colors
            WHERE  name LIKE ?
            AND    user_id = ?
        ");

        $statement->bind_param("ss", "%" . $inData["search"] . "%", $inData["user_id"]);
        $statement->execute();
        $result = $statement->get_result();

        while($row = $result->fetch_assoc())
        {
            if ($searchCount > 0)
            {
                $searchResults .= ",";
            }
            $searchCount++;
            $searchResults .= '"' . $row["name"] . '"';
        }

        if ($searchCount == 0)
        {
            returnWithError("No Records Found");
        }
        else
        {
            returnWithInfo($searchResults);
        }

        $statement->close();
        $connection->close();
    }

    function returnWithError($error)
    {
        $returnValue =
        '{
            "id" : 0,
            "first_name" : "",
            "last_name" : "",
            "error" : "' . $error . '"
        }';
        sendResultInfoAsJson($returnValue);
    }

    function returnSuccess($searchResults)
    {
        $returnValue =
        '{
            "results" : [' . $searchResults . '],
            "error" : ""
        }';
        sendResultInfoAsJson($returnValue);
    }

    function sendResultInfoAsJson($object)
    {
        header('Content-type: application/json');
        echo $object;
    }
?>