# Luxury Yachts - Docker Setup

Проект для бронирования яхт в Дубае с Docker контейнеризацией.

## Структура проекта

- `backend/` - PHP API (Laravel-like структура)
- `frontend/` - Next.js приложение
- `docker-compose.yml` - Production конфигурация
- `docker-compose.dev.yml` - Development конфигурация

## Быстрый старт

### Production режим

```bash
docker-compose up -d
```

Или используя Makefile:

```bash
make up
```

### Development режим (только backend + MySQL)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

Или:

```bash
make dev-up
```

Frontend запускается отдельно:

```bash
cd frontend
pnpm install
pnpm dev
```

## Сервисы

После запуска доступны:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **MySQL**: localhost:3306

## Переменные окружения

Создайте файл `.env` в корне проекта (можно скопировать из `.env.example`):

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=luxury_yachts
MYSQL_USER=yachts_user
MYSQL_PASSWORD=yachts_password

NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## База данных

База данных автоматически инициализируется при первом запуске из файлов:
- `backend/database/schema.sql` - создание таблиц
- `backend/database/seed.sql` - начальные данные

## Полезные команды

```bash
# Запуск всех сервисов
make up

# Остановка всех сервисов
make down

# Пересборка контейнеров
make rebuild

# Просмотр логов
make logs

# Очистка всех данных
make clean

# Development режим
make dev-up
make dev-logs
make dev-down
```

## Доступ к базе данных

- **Host**: localhost
- **Port**: 3306
- **Database**: luxury_yachts
- **User**: yachts_user (или из .env)
- **Password**: yachts_password (или из .env)

## Админ панель

- URL: http://localhost:3000/admin
- Email: admin@yachts.com
- Password: password

## Troubleshooting

Если возникают проблемы с подключением к БД, убедитесь что:
1. MySQL контейнер запущен и здоров (`docker-compose ps`)
2. Переменные окружения в `.env` совпадают с настройками в `Database.php`
3. БД инициализирована (проверьте логи MySQL контейнера)
