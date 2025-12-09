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

$yachtsQuery = "SELECT COUNT(*) as total FROM yachts";
$yachtsStmt = $db->prepare($yachtsQuery);
$yachtsStmt->execute();
$totalYachts = $yachtsStmt->fetch()['total'];

$bookingsQuery = "SELECT COUNT(*) as total FROM bookings WHERE status IN ('pending', 'confirmed')";
$bookingsStmt = $db->prepare($bookingsQuery);
$bookingsStmt->execute();
$activeBookings = $bookingsStmt->fetch()['total'];

$revenueQuery = "SELECT SUM(total_price) as total FROM bookings WHERE status IN ('confirmed', 'completed') AND MONTH(created_at) = MONTH(CURRENT_DATE())";
$revenueStmt = $db->prepare($revenueQuery);
$revenueStmt->execute();
$monthlyRevenue = $revenueStmt->fetch()['total'] ?? 0;

$destinationsQuery = "SELECT COUNT(*) as total FROM destinations";
$destinationsStmt = $db->prepare($destinationsQuery);
$destinationsStmt->execute();
$totalDestinations = $destinationsStmt->fetch()['total'];

$categoryQuery = "SELECT category, COUNT(*) as count FROM yachts GROUP BY category";
$categoryStmt = $db->prepare($categoryQuery);
$categoryStmt->execute();
$categories = $categoryStmt->fetchAll();

$recentBookingsQuery = "SELECT b.*, y.name as yacht_name, d.name as destination_name 
                       FROM bookings b 
                       LEFT JOIN yachts y ON b.yacht_id = y.id 
                       LEFT JOIN destinations d ON b.destination_id = d.id 
                       ORDER BY b.created_at DESC LIMIT 5";
$recentStmt = $db->prepare($recentBookingsQuery);
$recentStmt->execute();
$recentBookings = $recentStmt->fetchAll();

Response::success([
    'total_yachts' => (int)$totalYachts,
    'active_bookings' => (int)$activeBookings,
    'monthly_revenue' => (float)$monthlyRevenue,
    'total_destinations' => (int)$totalDestinations,
    'categories' => $categories,
    'recent_bookings' => $recentBookings
], 'Statistics retrieved');

