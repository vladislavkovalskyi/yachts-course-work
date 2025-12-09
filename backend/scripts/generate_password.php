<?php

if ($argc < 2) {
    echo "Usage: php generate_password.php <password>\n";
    exit(1);
}

$password = $argv[1];
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "Password: $password\n";
echo "Hash: $hash\n";
echo "\nSQL:\n";
echo "UPDATE users SET password = '$hash' WHERE email = 'admin@yachts.com';\n";

