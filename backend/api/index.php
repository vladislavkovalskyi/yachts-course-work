<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://frontend:3000'];
    
    if (!empty($origin) && in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    } elseif (!empty($origin)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
    } else {
        header("Access-Control-Allow-Origin: *");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 3600');
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/Response.php';
require_once __DIR__ . '/../includes/Auth.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

$basePath = '/api';
$path = str_replace($basePath, '', parse_url($requestUri, PHP_URL_PATH));
$pathParts = array_filter(explode('/', $path));
$pathParts = array_values($pathParts);

if (empty($pathParts)) {
    Response::json([
        'success' => true,
        'message' => 'Luxury Yachts API',
        'version' => APP_VERSION
    ]);
}

$route = $pathParts[0] ?? '';
$id = $pathParts[1] ?? null;

switch ($route) {
    case 'auth':
        require_once __DIR__ . '/auth/index.php';
        break;
    
    case 'yachts':
        require_once __DIR__ . '/yachts/index.php';
        break;
    
    case 'destinations':
        require_once __DIR__ . '/destinations/index.php';
        break;
    
    case 'bookings':
        require_once __DIR__ . '/bookings/index.php';
        break;
    
    case 'admin':
        require_once __DIR__ . '/admin/index.php';
        break;
    
    default:
        Response::notFound('Route not found');
}

