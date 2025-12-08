<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';
require_once __DIR__ . '/../../includes/Database.php';

$auth = new Auth();
$user = $auth->requireAdmin();

if (!$user) {
    Response::forbidden('Admin access required');
}

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

$pathParts = array_filter(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
$pathParts = array_values($pathParts);
$id = $pathParts[3] ?? null;

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
            $query = "SELECT * FROM destinations ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $destinations = $stmt->fetchAll();
            
            Response::success($destinations, 'Destinations retrieved');
        }
        break;
    
    case 'POST':
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        $duration = $input['duration'] ?? null;
        $image = $input['image'] ?? null;
        
        if (!$name || !$description || !$duration) {
            Response::error('Missing required fields', 400);
        }
        
        $query = "INSERT INTO destinations (name, description, duration, image) 
                  VALUES (:name, :description, :duration, :image)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':duration', $duration);
        $stmt->bindParam(':image', $image);
        
        if ($stmt->execute()) {
            $destinationId = $db->lastInsertId();
            
            $selectQuery = "SELECT * FROM destinations WHERE id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(':id', $destinationId);
            $selectStmt->execute();
            $destination = $selectStmt->fetch();
            
            Response::success($destination, 'Destination created successfully', 201);
        } else {
            Response::error('Failed to create destination', 500);
        }
        break;
    
    case 'PUT':
        if (!$id) {
            Response::error('Destination ID is required', 400);
        }
        
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        $duration = $input['duration'] ?? null;
        $image = $input['image'] ?? null;
        
        $query = "UPDATE destinations SET ";
        $updates = [];
        $params = [':id' => $id];
        
        if ($name !== null) {
            $updates[] = "name = :name";
            $params[':name'] = $name;
        }
        if ($description !== null) {
            $updates[] = "description = :description";
            $params[':description'] = $description;
        }
        if ($duration !== null) {
            $updates[] = "duration = :duration";
            $params[':duration'] = $duration;
        }
        if ($image !== null) {
            $updates[] = "image = :image";
            $params[':image'] = $image;
        }
        
        if (empty($updates)) {
            Response::error('No fields to update', 400);
        }
        
        $query .= implode(', ', $updates) . " WHERE id = :id";
        
        $stmt = $db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        if ($stmt->execute()) {
            $selectQuery = "SELECT * FROM destinations WHERE id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(':id', $id);
            $selectStmt->execute();
            $destination = $selectStmt->fetch();
            
            Response::success($destination, 'Destination updated successfully');
        } else {
            Response::error('Failed to update destination', 500);
        }
        break;
    
    case 'DELETE':
        if (!$id) {
            Response::error('Destination ID is required', 400);
        }
        
        $query = "DELETE FROM destinations WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            Response::success(null, 'Destination deleted successfully');
        } else {
            Response::error('Failed to delete destination', 500);
        }
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

