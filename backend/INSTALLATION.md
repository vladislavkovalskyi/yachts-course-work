# Инструкция по установке

## Требования

- PHP 7.4 или выше
- MySQL 5.7 или выше
- Apache с mod_rewrite или Nginx
- Расширения PHP: PDO, PDO_MySQL, JSON

## Установка

### 1. Настройка базы данных

Выполните SQL скрипты для создания базы данных и таблиц:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

Или выполните вручную через phpMyAdmin или другой клиент MySQL.

### 2. Настройка подключения к базе данных

Откройте файл `includes/Database.php` и измените параметры подключения:

```php
private $host = 'localhost';
private $db_name = 'luxury_yachts';
private $username = 'root';
private $password = 'ваш_пароль';
```

### 3. Настройка веб-сервера

#### Apache

Убедитесь, что mod_rewrite включен:
```bash
sudo a2enmod rewrite
sudo service apache2 restart
```

Настройте виртуальный хост, указывающий на папку `backend`:
```apache
<VirtualHost *:80>
    ServerName api.yachts.local
    DocumentRoot /path/to/luxuryyachts/backend
    
    <Directory /path/to/luxuryyachts/backend>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name api.yachts.local;
    root /path/to/luxuryyachts/backend;
    index index.php;

    location / {
        try_files $uri $uri/ /api/index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

### 4. Настройка CORS (если нужно)

Откройте `config/config.php` и добавьте ваш фронтенд URL в массив `CORS_ALLOWED_ORIGINS`:

```php
define('CORS_ALLOWED_ORIGINS', [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yourdomain.com',
]);
```

### 5. Проверка установки

Откройте в браузере:
```
http://api.yachts.local/api
```

Должен вернуться JSON ответ:
```json
{
  "success": true,
  "message": "Luxury Yachts API",
  "version": "1.0.0"
}
```

## Тестирование API

### Вход в систему

```bash
curl -X POST http://api.yachts.local/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yachts.com","password":"password"}'
```

Ответ:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@yachts.com",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Получение списка яхт

```bash
curl http://api.yachts.local/api/yachts
```

### Создание бронирования

```bash
curl -X POST http://api.yachts.local/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "yacht_id": 1,
    "destination_id": 1,
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "customer_phone": "+971 50 123 4567",
    "date": "2025-02-15",
    "hours": 4,
    "notes": "Special request"
  }'
```

### Админ: Получение списка бронирований

```bash
curl http://api.yachts.local/api/admin/bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Безопасность

1. **Измените JWT_SECRET** в `config/config.php` на случайную строку
2. **Измените пароль администратора** после первого входа
3. **Используйте HTTPS** в продакшене
4. **Ограничьте CORS** только нужными доменами
5. **Регулярно обновляйте** PHP и MySQL

## Устранение неполадок

### Ошибка 500 Internal Server Error

- Проверьте логи Apache/Nginx
- Убедитесь, что PHP расширения установлены
- Проверьте права доступа к файлам

### Ошибка подключения к базе данных

- Проверьте параметры подключения в `includes/Database.php`
- Убедитесь, что MySQL запущен
- Проверьте, что база данных создана

### CORS ошибки

- Проверьте настройки CORS в `config/config.php`
- Убедитесь, что заголовки отправляются правильно
- Проверьте `.htaccess` файл

