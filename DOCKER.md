# Docker Setup Guide

## Требования

- Docker 20.10+
- Docker Compose 2.0+

## Быстрый старт

### 1. Создайте файл `.env` в корне проекта:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=luxury_yachts
MYSQL_USER=yachts_user
MYSQL_PASSWORD=yachts_password

NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Запустите все сервисы:

```bash
docker-compose up -d
```

### 3. Проверьте статус:

```bash
docker-compose ps
```

## Доступ к сервисам

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## Полезные команды

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Пересборка
docker-compose build --no-cache
docker-compose up -d

# Логи
docker-compose logs -f [service_name]

# Вход в контейнер
docker exec -it yachts_backend bash
docker exec -it yachts_mysql mysql -u yachts_user -p luxury_yachts

# Очистка
docker-compose down -v
```

## Development режим

Для разработки используйте `docker-compose.dev.yml` (только backend + MySQL):

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Frontend запускайте локально:

```bash
cd frontend
pnpm install
pnpm dev
```

## Troubleshooting

### Проблемы с подключением к БД

1. Проверьте, что MySQL контейнер запущен:
   ```bash
   docker-compose ps mysql
   ```

2. Проверьте логи MySQL:
   ```bash
   docker-compose logs mysql
   ```

3. Убедитесь, что переменные окружения совпадают в `.env` и `Database.php`

### Проблемы с CORS

Если возникают CORS ошибки, убедитесь что в `backend/config/config.php` добавлен ваш frontend URL в `CORS_ALLOWED_ORIGINS`.

### Пересоздание базы данных

```bash
docker-compose down -v
docker-compose up -d
```

Это удалит все данные и пересоздаст БД с начальными данными из seed.sql.

