<?php

require_once __DIR__ . '/../../includes/Response.php';
require_once __DIR__ . '/../../includes/Auth.php';
require_once __DIR__ . '/../../includes/Database.php';

$auth = new Auth();
$user = $auth->requireAdmin();

if (!$user) {
    Response::forbidden('Admin access required');
}

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

$pathParts = array_filter(explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)));
$pathParts = array_values($pathParts);
$id = $pathParts[3] ?? null;
$action = $pathParts[4] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $query = "SELECT b.*, y.name as yacht_name, y.image as yacht_image, d.name as destination_name 
                     FROM bookings b 
                     LEFT JOIN yachts y ON b.yacht_id = y.id 
                     LEFT JOIN destinations d ON b.destination_id = d.id 
                     WHERE b.id = :id LIMIT 1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            
            $booking = $stmt->fetch();
            
            if (!$booking) {
                Response::notFound('Booking not found');
            }
            
            Response::success($booking, 'Booking retrieved');
        } else {
            $status = $_GET['status'] ?? null;
            $search = $_GET['search'] ?? null;
            
            $query = "SELECT b.*, y.name as yacht_name, d.name as destination_name 
                     FROM bookings b 
                     LEFT JOIN yachts y ON b.yacht_id = y.id 
                     LEFT JOIN destinations d ON b.destination_id = d.id 
                     WHERE 1=1";
            $params = [];
            
            if ($status && $status !== 'all') {
                $query .= " AND b.status = :status";
                $params[':status'] = $status;
            }
            
            if ($search) {
                $query .= " AND (b.customer_name LIKE :search OR b.customer_email LIKE :search OR y.name LIKE :search)";
                $params[':search'] = "%$search%";
            }
            
            $query .= " ORDER BY b.created_at DESC";
            
            $stmt = $db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            $stmt->execute();
            
            $bookings = $stmt->fetchAll();
            
            Response::success($bookings, 'Bookings retrieved');
        }
        break;
    
    case 'PUT':
        if (!$id) {
            Response::error('Booking ID is required', 400);
        }
        
        if ($action === 'status') {
            $status = $input['status'] ?? null;
            
            if (!$status || !in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'])) {
                Response::error('Invalid status', 400);
            }
            
            $query = "UPDATE bookings SET status = :status WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $id);
            
            if ($stmt->execute()) {
                $selectQuery = "SELECT b.*, y.name as yacht_name, d.name as destination_name 
                               FROM bookings b 
                               LEFT JOIN yachts y ON b.yacht_id = y.id 
                               LEFT JOIN destinations d ON b.destination_id = d.id 
                               WHERE b.id = :id";
                $selectStmt = $db->prepare($selectQuery);
                $selectStmt->bindParam(':id', $id);
                $selectStmt->execute();
                $booking = $selectStmt->fetch();
                
                Response::success($booking, 'Booking status updated successfully');
            } else {
                Response::error('Failed to update booking status', 500);
            }
        } else {
            $customerName = $input['customer_name'] ?? null;
            $customerEmail = $input['customer_email'] ?? null;
            $customerPhone = $input['customer_phone'] ?? null;
            $date = $input['date'] ?? null;
            $hours = $input['hours'] ?? null;
            $notes = $input['notes'] ?? null;
            
            $query = "UPDATE bookings SET ";
            $updates = [];
            $params = [':id' => $id];
            
            if ($customerName !== null) {
                $updates[] = "customer_name = :customer_name";
                $params[':customer_name'] = $customerName;
            }
            if ($customerEmail !== null) {
                $updates[] = "customer_email = :customer_email";
                $params[':customer_email'] = $customerEmail;
            }
            if ($customerPhone !== null) {
                $updates[] = "customer_phone = :customer_phone";
                $params[':customer_phone'] = $customerPhone;
            }
            if ($date !== null) {
                $updates[] = "date = :date";
                $params[':date'] = $date;
            }
            if ($hours !== null) {
                $updates[] = "hours = :hours";
                $params[':hours'] = $hours;
            }
            if (isset($input['notes'])) {
                $updates[] = "notes = :notes";
                $params[':notes'] = $input['notes'];
            }
            
            if (empty($updates)) {
                Response::error('No fields to update', 400);
            }
            
            $query .= implode(', ', $updates) . " WHERE id = :id";
            
            $stmt = $db->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            if ($stmt->execute()) {
                $selectQuery = "SELECT b.*, y.name as yacht_name, d.name as destination_name 
                             FROM bookings b 
                             LEFT JOIN yachts y ON b.yacht_id = y.id 
                             LEFT JOIN destinations d ON b.destination_id = d.id 
                             WHERE b.id = :id";
                $selectStmt = $db->prepare($selectQuery);
                $selectStmt->bindParam(':id', $id);
                $selectStmt->execute();
                $booking = $selectStmt->fetch();
                
                Response::success($booking, 'Booking updated successfully');
            } else {
                Response::error('Failed to update booking', 500);
            }
        }
        break;
    
    case 'DELETE':
        if (!$id) {
            Response::error('Booking ID is required', 400);
        }
        
        $query = "DELETE FROM bookings WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);
        
        if ($stmt->execute()) {
            Response::success(null, 'Booking deleted successfully');
        } else {
            Response::error('Failed to delete booking', 500);
        }
        break;
    
    default:
        Response::error('Method not allowed', 405);
}

