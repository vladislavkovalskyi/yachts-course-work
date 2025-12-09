<?php

$requestUri = $_SERVER['REQUEST_URI'];
$requestPath = parse_url($requestUri, PHP_URL_PATH);

if (file_exists(__DIR__ . $requestPath) && !is_dir(__DIR__ . $requestPath)) {
    return false;
}

if (strpos($requestPath, '/api') === 0) {
    require __DIR__ . '/api/index.php';
    return true;
}

return false;

