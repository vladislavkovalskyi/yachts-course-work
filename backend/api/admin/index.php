<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::json(['success' => true], 200);
}

$auth = new Auth();
$user = $auth->requireAdmin();

if (!$user) {
    Response::forbidden('Admin access required');
}

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = array_filter(explode('/', $requestPath));
$pathParts = array_values($pathParts);

$resource = null;
if (count($pathParts) >= 3 && $pathParts[0] === 'api' && $pathParts[1] === 'admin') {
    $resource = $pathParts[2] ?? null;
} elseif (count($pathParts) >= 1 && $pathParts[0] === 'admin') {
    $resource = $pathParts[1] ?? null;
}

switch ($resource) {
    case 'yachts':
        require_once __DIR__ . '/yachts.php';
        break;
    
    case 'destinations':
        require_once __DIR__ . '/destinations.php';
        break;
    
    case 'bookings':
        require_once __DIR__ . '/bookings.php';
        break;
    
    case 'stats':
        require_once __DIR__ . '/stats.php';
        break;
    
    default:
        Response::notFound('Admin resource not found');
}

