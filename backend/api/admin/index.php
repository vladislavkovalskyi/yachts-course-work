<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';

$auth = new Auth();
$user = $auth->requireAdmin();

if (!$user) {
    Response::forbidden('Admin access required');
}

$pathParts = array_filter(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
$pathParts = array_values($pathParts);
$resource = $pathParts[2] ?? null;

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

