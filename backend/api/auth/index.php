<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';
require_once __DIR__ . '/../../includes/Database.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::json(['success' => true], 200);
}

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
        } elseif ($action === 'register') {
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $name = $input['name'] ?? '';
            
            if (empty($email) || empty($password) || empty($name)) {
                Response::error('Email, password and name are required', 400);
            }
            
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Response::error('Invalid email format', 400);
            }
            
            if (strlen($password) < 6) {
                Response::error('Password must be at least 6 characters', 400);
            }
            
            $database = new Database();
            $db = $database->getConnection();
            
            $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->bindParam(':email', $email);
            $checkStmt->execute();
            
            if ($checkStmt->fetch()) {
                Response::error('Email already registered', 400);
            }
            
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $role = 'user';
            
            $insertQuery = "INSERT INTO users (email, password, name, role) VALUES (:email, :password, :name, :role)";
            $insertStmt = $db->prepare($insertQuery);
            $insertStmt->bindParam(':email', $email);
            $insertStmt->bindParam(':password', $hashedPassword);
            $insertStmt->bindParam(':name', $name);
            $insertStmt->bindParam(':role', $role);
            
            if ($insertStmt->execute()) {
                $userId = $db->lastInsertId();
                $user = $auth->getUserById($userId);
                $token = $auth->generateToken($user);
                
                Response::success([
                    'user' => $user,
                    'token' => $token
                ], 'Registration successful', 201);
            } else {
                Response::error('Failed to create user', 500);
            }
        } else {
            Response::error('Invalid action', 400);
        }
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

