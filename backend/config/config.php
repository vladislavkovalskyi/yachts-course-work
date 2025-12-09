<?php

define('APP_NAME', 'Luxury Yachts API');
define('APP_VERSION', '1.0.0');

define('JWT_SECRET', 'SOME-SECRET-KEY-123ABC');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRATION', 86400);

define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://frontend:3000',
]);

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_UPLOAD_SIZE', 5242880);

