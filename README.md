# 🐇 Pub/Sub RabbitMQ Example

Pub/Sub messaging system using NestJS + RabbitMQ with Docker.

## 🚀 How to Use

### Start all services:

```bash
docker-compose up --build
```

### View logs:

```bash
docker-compose logs -f
```

### Stop everything:

```bash
docker-compose down
```

## ✨ Hot Reload

**Hot reload is ACTIVE!** When you edit any `.ts` file, nodemon will detect it and automatically restart the service.

- Edit any file in `api/src/`, `hub-command-worker/src/`, etc.
- Wait ~3-5 seconds
- Nodemon will restart automatically
- You'll see `[nodemon] restarting due to changes...` in the logs

## 📡 Test the system:

```bash
# Create an item (hub.command.insert)
curl -X POST http://localhost:3000/api/hub -H "Content-Type: application/json" -d '{"name":"Arthur"}'

# Delete an item (hub.command.delete)
curl -X DELETE http://localhost:3000/api/hub/123
```

## 🏗️ Architecture

- **API** (port 3000): HTTP API that publishes messages
- **hub-command-worker** (port 3001): Processes commands (hub.command.\*)
- **hub-event-worker** (port 3003): Processes events (hub.event.\*)
- **hub-log-worker** (port 3004): Logs ALL messages (#)
- **RabbitMQ** (port 5672 + 15672): Message broker

## 🔥 Simplified

- 1 `Dockerfile` per service (dev mode)
- 1 single `docker-compose.yml`
- Hot reload with nodemon + --legacy-watch
- No unnecessary files!
