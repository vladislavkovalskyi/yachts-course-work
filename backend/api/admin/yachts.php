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
            $query = "SELECT * FROM yachts WHERE id = :id LIMIT 1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $yacht = $stmt->fetch();
            
            if (!$yacht) {
                Response::notFound('Yacht not found');
            }
            
            if ($yacht['features']) {
                $yacht['features'] = json_decode($yacht['features'], true);
            }
            
            Response::success($yacht, 'Yacht retrieved');
        } else {
            $query = "SELECT * FROM yachts ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $yachts = $stmt->fetchAll();
            
            foreach ($yachts as &$yacht) {
                if ($yacht['features']) {
                    $yacht['features'] = json_decode($yacht['features'], true);
                }
            }
            
            Response::success($yachts, 'Yachts retrieved');
        }
        break;
    
    case 'POST':
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        $price = $input['price'] ?? null;
        $capacity = $input['capacity'] ?? null;
        $length = $input['length'] ?? null;
        $category = $input['category'] ?? 'luxury';
        $features = $input['features'] ?? [];
        $image = $input['image'] ?? null;
        
        if (!$name || !$description || !$price || !$capacity || !$length) {
            Response::error('Missing required fields', 400);
        }
        
        if (!in_array($category, ['premium', 'luxury', 'ultra-luxury'])) {
            Response::error('Invalid category', 400);
        }
        
        $featuresJson = json_encode($features);
        
        $query = "INSERT INTO yachts (name, description, price, capacity, length, category, features, image) 
                  VALUES (:name, :description, :price, :capacity, :length, :category, :features, :image)";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':capacity', $capacity);
        $stmt->bindParam(':length', $length);
        $stmt->bindParam(':category', $category);
        $stmt->bindParam(':features', $featuresJson);
        $stmt->bindParam(':image', $image);
        
        if ($stmt->execute()) {
            $yachtId = $db->lastInsertId();
            
            $selectQuery = "SELECT * FROM yachts WHERE id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(':id', $yachtId);
            $selectStmt->execute();
            $yacht = $selectStmt->fetch();
            
            if ($yacht['features']) {
                $yacht['features'] = json_decode($yacht['features'], true);
            }
            
            Response::success($yacht, 'Yacht created successfully', 201);
        } else {
            Response::error('Failed to create yacht', 500);
        }
        break;
    
    case 'PUT':
        if (!$id) {
            Response::error('Yacht ID is required', 400);
        }
        
        $name = $input['name'] ?? null;
        $description = $input['description'] ?? null;
        $price = $input['price'] ?? null;
        $capacity = $input['capacity'] ?? null;
        $length = $input['length'] ?? null;
        $category = $input['category'] ?? null;
        $features = $input['features'] ?? null;
        $image = $input['image'] ?? null;
        
        $query = "UPDATE yachts SET ";
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
        if ($price !== null) {
            $updates[] = "price = :price";
            $params[':price'] = $price;
        }
        if ($capacity !== null) {
            $updates[] = "capacity = :capacity";
            $params[':capacity'] = $capacity;
        }
        if ($length !== null) {
            $updates[] = "length = :length";
            $params[':length'] = $length;
        }
        if ($category !== null && in_array($category, ['premium', 'luxury', 'ultra-luxury'])) {
            $updates[] = "category = :category";
            $params[':category'] = $category;
        }
        if ($features !== null) {
            $updates[] = "features = :features";
            $params[':features'] = json_encode($features);
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
            $selectQuery = "SELECT * FROM yachts WHERE id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(':id', $id);
            $selectStmt->execute();
            $yacht = $selectStmt->fetch();
            
            if ($yacht['features']) {
                $yacht['features'] = json_decode($yacht['features'], true);
            }
            
            Response::success($yacht, 'Yacht updated successfully');
        } else {
            Response::error('Failed to update yacht', 500);
        }
        break;
    
    case 'DELETE':
        if (!$id) {
            Response::error('Yacht ID is required', 400);
        }
        
        $query = "DELETE FROM yachts WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            Response::success(null, 'Yacht deleted successfully');
        } else {
            Response::error('Failed to delete yacht', 500);
        }
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

