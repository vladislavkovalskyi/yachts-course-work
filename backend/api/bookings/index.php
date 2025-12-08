<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';
require_once __DIR__ . '/../../includes/Database.php';

$auth = new Auth();
$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'POST':
        $yachtId = $input['yacht_id'] ?? null;
        $destinationId = $input['destination_id'] ?? null;
        $customerName = $input['customer_name'] ?? null;
        $customerEmail = $input['customer_email'] ?? null;
        $customerPhone = $input['customer_phone'] ?? null;
        $date = $input['date'] ?? null;
        $hours = $input['hours'] ?? null;
        $notes = $input['notes'] ?? null;
        
        if (!$yachtId || !$customerName || !$customerEmail || !$customerPhone || !$date || !$hours) {
            Response::error('Missing required fields', 400);
        }
        
        $yachtQuery = "SELECT price FROM yachts WHERE id = :yacht_id LIMIT 1";
        $yachtStmt = $db->prepare($yachtQuery);
        $yachtStmt->bindParam(':yacht_id', $yachtId);
        $yachtStmt->execute();
        $yacht = $yachtStmt->fetch();
        
        if (!$yacht) {
            Response::error('Yacht not found', 404);
        }
        
        $totalPrice = $yacht['price'] * $hours;
        
        $query = "INSERT INTO bookings (yacht_id, destination_id, customer_name, customer_email, customer_phone, date, hours, total_price, notes, status) 
                  VALUES (:yacht_id, :destination_id, :customer_name, :customer_email, :customer_phone, :date, :hours, :total_price, :notes, 'pending')";
        
        $stmt = $db->prepare($query);
        $stmt->bindParam(':yacht_id', $yachtId);
        $stmt->bindParam(':destination_id', $destinationId);
        $stmt->bindParam(':customer_name', $customerName);
        $stmt->bindParam(':customer_email', $customerEmail);
        $stmt->bindParam(':customer_phone', $customerPhone);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':hours', $hours);
        $stmt->bindParam(':total_price', $totalPrice);
        $stmt->bindParam(':notes', $notes);
        
        if ($stmt->execute()) {
            $bookingId = $db->lastInsertId();
            
            $selectQuery = "SELECT b.*, y.name as yacht_name, d.name as destination_name 
                           FROM bookings b 
                           LEFT JOIN yachts y ON b.yacht_id = y.id 
                           LEFT JOIN destinations d ON b.destination_id = d.id 
                           WHERE b.id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(':id', $bookingId);
            $selectStmt->execute();
            $booking = $selectStmt->fetch();
            
            Response::success($booking, 'Booking created successfully', 201);
        } else {
            Response::error('Failed to create booking', 500);
        }
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

