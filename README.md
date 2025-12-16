# 🐇 Pub/Sub RabbitMQ Example

Pub/Sub messaging system using NestJS + RabbitMQ with Docker.

## � What is this?

This is a **true Pub/Sub (broadcast)** system where:

- The **API** publishes messages to RabbitMQ
- **Workers** listen to messages based on routing patterns
- Each worker receives its own copy of the message (no load balancing)

### How it works:

1. **API receives HTTP request** → Publishes message to RabbitMQ with a routing key (e.g., `hub.command.insert`)
2. **RabbitMQ Exchange (topic)** → Routes message to queues based on patterns
3. **Workers consume messages** → Each worker has an exclusive queue and processes its copy

### Message Flow Example:

```
POST /api/hub { "name": "Arthur" }
         ↓
    API publishes: hub.command.insert
         ↓
    RabbitMQ Exchange (topic: "hub")
         ↓
    ┌────────────┬────────────┬────────────┐
    ↓            ↓            ↓            ↓
Command-W    Event-W      Log-W         (Future workers)
Processes    Listens to   Logs ALL      Just add more!
hub.command.* specific    messages
             patterns     with #
```

### Workers explained:

- **hub-command-worker**: Processes commands (`hub.command.*`)

  - Receives: `hub.command.insert`, `hub.command.delete`, etc.
  - After processing, can publish events (Event Choreography pattern) like hub.event.user-created

- **hub-event-worker**: Processes events (`hub.event.*`)

  - Receives: `hub.event.user-created`, `hub.event.notify`, etc.

- **hub-log-worker**: Universal logger (pattern `#` = wildcard for ALL messages)
  - Receives: Everything published to the exchange
  - Uses `@OnEvent('**')` to catch all events internally

### Key Architecture Decisions:

✅ **Topic exchange** - Flexible routing with patterns (`*` = one word, `#` = zero or more words)  
✅ **EventEmitter2** - Internal routing with `@OnEvent` decorators (clean controller code)  
✅ **Nodemon + Docker volumes** - Hot reload during development

## �🚀 How to Use

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
