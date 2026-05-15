# Deployment

## Container Topology

```
  ┌─────────────────┐    ┌─────────────────┐
  │  web (Next.js)  │    │  api (Node)     │
  │  port 3000      │    │  port 4000      │
  └────────┬────────┘    └────────┬────────┘
           │                      │
           ▼                      ▼
        Nginx / ALB (HTTPS, WAF, rate limit)
                       │
                       ▼
        ┌──────────────┴──────────────┐
        │  postgres │ redis │ workers │
        └─────────────────────────────┘
```

## docker-compose (local / staging)

```yaml
version: "3.9"
services:
  web:
    build: ./apps/web
    env_file: ./apps/web/.env
    ports: ["3000:3000"]

  api:
    build: ./apps/api
    env_file: ./apps/api/.env
    depends_on: [postgres, redis]
    ports: ["4000:4000"]

  worker:
    build: ./apps/api
    command: node dist/worker.js
    env_file: ./apps/api/.env
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: attendly
      POSTGRES_PASSWORD: attendly
      POSTGRES_DB: attendly
    volumes: [pg:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes: [redis:/data]

volumes: { pg:, redis: }
```

## Required Env Vars (api)

| Var                       | Purpose                                  |
|---------------------------|------------------------------------------|
| `DATABASE_URL`            | Postgres connection                      |
| `REDIS_URL`               | Redis connection                         |
| `JWT_ACCESS_SECRET`       | HS256 signing key                        |
| `JWT_REFRESH_SECRET`      | HS256 signing key                        |
| `QR_SIGNING_KEY`          | 32-byte secret for QR HMAC               |
| `APP_REQUEST_KEY`         | Symmetric base for request signing       |
| `PLAY_INTEGRITY_KEY`      | Google service account JSON              |
| `APPLE_TEAM_ID`           | For App Attest                           |
| `S3_BUCKET`, `S3_REGION`  | Report storage                           |
| `SMTP_*`                  | Email                                    |
| `PUSH_FCM_KEY`            | FCM push                                 |

## CI/CD

GitHub Actions pipeline (`.github/workflows/ci.yml`):

1. `pnpm install --frozen-lockfile`
2. `pnpm -r lint && pnpm -r test`
3. Prisma migration check (`prisma migrate diff`)
4. Build Docker images, push to registry
5. Deploy via Helm / ECS task definition update

## Kubernetes Sketch

- `Deployment` web (2+ replicas), api (3+ replicas), worker (2+ replicas)
- `HorizontalPodAutoscaler` on api CPU > 60%
- `Service` ClusterIP per component, `Ingress` (nginx) terminates TLS
- `Secret` for env vars, `ConfigMap` for non-secret config
- `CronJob` nightly: audit log archival to S3, fraud-score recompute

## Observability

- Logs → JSON to stdout → Loki / CloudWatch
- Metrics → Prometheus (`/metrics` exposed by api)
- Traces → OpenTelemetry exporter to Tempo / Jaeger
- Errors → Sentry

## Backups

- Postgres: nightly full + 15-min WAL to S3, 30-day retention
- Redis: AOF on, snapshotted hourly (nonces are ephemeral, just sessions matter)
- S3 reports: versioning + lifecycle to Glacier after 90 days
