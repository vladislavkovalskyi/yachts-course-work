<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';

$auth = new Auth();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? 'login';
        
        if ($action === 'login') {
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                Response::error('Email and password are required', 400);
            }
            
            $user = $auth->login($email, $password);
            
            if (!$user) {
                Response::error('Invalid credentials', 401);
            }
            
            $token = $auth->generateToken($user);
            
            Response::success([
                'user' => $user,
                'token' => $token
            ], 'Login successful');
        }
        
        Response::error('Invalid action', 400);
        break;
    
    case 'GET':
        if (isset($_GET['me'])) {
            $user = $auth->requireAuth();
            
            if (!$user) {
                Response::unauthorized('Authentication required');
            }
            
            Response::success(['user' => $user], 'User data retrieved');
        }
        
        Response::error('Invalid endpoint', 400);
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

