<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../includes/Response.php';
require_once __DIR__ . '/../includes/Auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::json(['success' => true], 200);
}

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

