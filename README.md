# HelaMaga Sync Frontend

A responsive Next.js passenger experience for the HelaMagaSycn railway booking platform. Visitors can search journeys, compare live seat availability and prices, and inspect the coach map without an account. Registration is required only when a passenger is ready to book.

## Passenger features

- Public journey search by origin, destination, travel date, and passenger count
- Live price and seat availability through the Spring Cloud Gateway
- Interactive multi-coach 2+2 seat map with windows, aisle, direction of travel, luggage, entrance, and priority-area details
- NIC, email, and full-name registration with email activation
- Keycloak OpenID Connect sign-in using Authorization Code + PKCE
- Protected multi-seat checkout and idempotent booking submission
- Booking timeline, payment/Saga status, booking history, profile, and help pages
- In-app, toast, and optional browser notifications for confirmed or failed bookings
- Responsive premium light UI using the supplied HelaMaga logo

## Run locally

Prerequisites: Node.js 24+, npm 11+, and the backend running at `http://localhost:8080`.

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). Grafana keeps the backend's existing port `3000`.

For local registration email, open Mailpit at [http://localhost:8025](http://localhost:8025). The activation link verifies the email, asks the passenger to choose a Keycloak password, and returns to the frontend sign-in screen.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `HELAMAGA_GATEWAY_URL` | `http://localhost:8080` | Server-side API proxy target |
| `NEXT_PUBLIC_API_BASE_URL` | `/api/backend` | Browser-facing API base |
| `NEXT_PUBLIC_KEYCLOAK_URL` | `http://localhost:8180` | Keycloak public URL |
| `NEXT_PUBLIC_KEYCLOAK_REALM` | `helamaga` | Keycloak realm |
| `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID` | `helamaga-web` | Public PKCE client |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Login callback and logout return URL |

The Next.js route handler is a backend-for-frontend proxy. It forwards only the required request headers and explicitly disables caching so live seat state is never served from a frontend cache.

## Quality checks

```powershell
npm run test
npm run typecheck
npm run lint
npm run build
```

Vitest and Testing Library cover seat selection states and domain formatting. CI runs all four checks on Node.js 24.

## Container image

```powershell
docker build -t helamaga/frontend:local .
docker run --rm -p 3001:3001 -e HELAMAGA_GATEWAY_URL=http://host.docker.internal:8080 helamaga/frontend:local
```

The production image runs as a non-root user and uses Next.js standalone output.
