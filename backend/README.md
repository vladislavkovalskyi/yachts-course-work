# Luxury Yachts Backend API

Backend API на PHP для проекта Luxury Yachts.

## Установка

1. Убедитесь, что установлены PHP 7.4+ и MySQL 5.7+

2. Создайте базу данных:
```bash
mysql -u root -p < database/schema.sql
```

3. Настройте подключение к базе данных в `config/database.php`:
```php
private $host = 'localhost';
private $db_name = 'luxury_yachts';
private $username = 'root';
private $password = '';
```

4. Настройте веб-сервер (Apache/Nginx) для работы с PHP

5. Убедитесь, что mod_rewrite включен для Apache

## API Endpoints

### Авторизация
- `POST /api/auth/login` - Вход в систему
- `GET /api/auth/me` - Получить текущего пользователя

### Яхты
- `GET /api/yachts` - Список яхт
- `GET /api/yachts/{id}` - Детали яхты

### Направления
- `GET /api/destinations` - Список направлений
- `GET /api/destinations/{id}` - Детали направления

### Бронирования
- `POST /api/bookings` - Создать бронирование

### Админ панель (требуется авторизация)

#### Яхты
- `GET /api/admin/yachts` - Список всех яхт
- `GET /api/admin/yachts/{id}` - Детали яхты
- `POST /api/admin/yachts` - Создать яхту
- `PUT /api/admin/yachts/{id}` - Обновить яхту
- `DELETE /api/admin/yachts/{id}` - Удалить яхту

#### Направления
- `GET /api/admin/destinations` - Список всех направлений
- `GET /api/admin/destinations/{id}` - Детали направления
- `POST /api/admin/destinations` - Создать направление
- `PUT /api/admin/destinations/{id}` - Обновить направление
- `DELETE /api/admin/destinations/{id}` - Удалить направление

#### Бронирования
- `GET /api/admin/bookings` - Список всех бронирований
- `GET /api/admin/bookings/{id}` - Детали бронирования
- `PUT /api/admin/bookings/{id}` - Обновить бронирование
- `PUT /api/admin/bookings/{id}/status` - Изменить статус бронирования
- `DELETE /api/admin/bookings/{id}` - Удалить бронирование

#### Статистика
- `GET /api/admin/stats` - Получить статистику

## Авторизация

Для доступа к админ панели используйте:
- Email: `admin@yachts.com`
- Password: `password` (по умолчанию)

**Важно:** Измените пароль администратора после первого входа!

Для генерации нового хеша пароля используйте:
```bash
php scripts/generate_password.php your_new_password
```

Затем выполните SQL запрос для обновления пароля в базе данных.

## Формат запросов

Все запросы должны содержать заголовок:
```
Content-Type: application/json
```

Для авторизованных запросов добавьте:
```
Authorization: Bearer {token}
```

## Формат ответов

Успешный ответ:
```json
{
  "success": true,
  "message": "Success",
  "data": {...}
}
```

Ошибка:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {...}
}
```

