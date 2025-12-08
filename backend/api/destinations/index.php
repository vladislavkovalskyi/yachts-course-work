<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';
require_once __DIR__ . '/../../includes/Database.php';

$auth = new Auth();
$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

$pathParts = array_filter(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
$pathParts = array_values($pathParts);
$id = $pathParts[2] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $query = "SELECT * FROM destinations WHERE id = :id LIMIT 1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $destination = $stmt->fetch();
            
            if (!$destination) {
                Response::notFound('Destination not found');
            }
            
            Response::success($destination, 'Destination retrieved');
        } else {
            $search = $_GET['search'] ?? null;
            
            $query = "SELECT * FROM destinations WHERE 1=1";
            $params = [];
            
            if ($search) {
                $query .= " AND (name LIKE :search OR description LIKE :search)";
                $params[':search'] = "%$search%";
            }
            
            $query .= " ORDER BY name ASC";
            
            $stmt = $db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $destinations = $stmt->fetchAll();
            
            Response::success($destinations, 'Destinations retrieved');
        }
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

