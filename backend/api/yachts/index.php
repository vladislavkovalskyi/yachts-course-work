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
            $category = $_GET['category'] ?? null;
            $search = $_GET['search'] ?? null;
            $sortBy = $_GET['sort'] ?? 'id';
            $order = $_GET['order'] ?? 'ASC';
            
            $query = "SELECT * FROM yachts WHERE 1=1";
            $params = [];
            
            if ($category && $category !== 'all') {
                $query .= " AND category = :category";
                $params[':category'] = $category;
            }
            
            if ($search) {
                $query .= " AND (name LIKE :search OR description LIKE :search)";
                $params[':search'] = "%$search%";
            }
            
            $allowedSorts = ['id', 'name', 'price', 'capacity', 'length'];
            $sortBy = in_array($sortBy, $allowedSorts) ? $sortBy : 'id';
            $order = strtoupper($order) === 'DESC' ? 'DESC' : 'ASC';
            
            $query .= " ORDER BY $sortBy $order";
            
            $stmt = $db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
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
    
    default:
        Response::error('Method not allowed', 405);
}

