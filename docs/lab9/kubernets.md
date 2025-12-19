# Практична робота 9 — Теоретична схема Kubernetes-додатку (Booking-system)

## 1. Короткий опис сервісу (2–3 речення)
Booking-system — веб-застосунок для бронювання послуг (наприклад, номери готелю або зустрічі). Має REST API для операцій з бронюваннями (клієнти, адміністратори) та SPA фронтенд для користувацького інтерфейсу. Користувачі: кінцеві клієнти (браузер/мобільний) та адміністратори у веб-інтерфейсі.

---

## 2. Зовнішня схема (від користувача до кластера)
Логічний ланцюжок:
Client → DNS → Load Balancer → Ingress (Ingress controller) → Kubernetes Cluster

- Домен: `booking.example.com` (приклад)
- DNS резолвить домен на IP зовнішнього Load Balancer-а (cloud LB).
- Load Balancer направляє HTTP(S) трафік до Ingress controller-а в кластері.
- Ingress (правила) маршрутизують за Host/Path:
  - Host = `booking.example.com`
  - Path `/api` → Service `booking-api-svc`
  - Path `/` (і інші статичні) → Service `booking-frontend-svc`

(На схемі обов'язково підписати Host та Paths поруч з Ingress.)

---

## 3. Внутрішня схема (всередині кластеру)
Всередині прямокутника "Kubernetes Cluster":

- Namespace:
  - `booking-prod`

- Deployments:
  - `booking-api`
    - replicas: 3
    - containerPort: `3000`
    - readiness/liveness probes → `/health` (приклад)
  - `booking-frontend`
    - replicas: 2
    - containerPort: `80`

- Services:
  - `booking-api-svc`
    - type: `ClusterIP`
    - port 80 → targetPort 3000
    - selector: `app=booking-api`
  - `booking-frontend-svc`
    - type: `ClusterIP`
    - port 80 → targetPort 80
    - selector: `app=booking-frontend`

- Pods:
  - Для `booking-api` — 3 Pod-и (відповідно до replicas)
  - Для `booking-frontend` — 2 Pod-и
  - Service розподіляє трафік між Pod-ами (load-balancing).

Потрібні стрілки у схемі:
- Ingress → booking-api-svc → Pod-и booking-api
- Ingress → booking-frontend-svc → Pod-и booking-frontend

---

## 4. Де з'являються git, CI/CD та registry
- git: `github.com/Aler1an/Booking-system` — джерело коду.
- CI/CD: GitHub Actions (`.github/workflows/ci-cd.yml`)
  - Тригери: push → main
  - Кроки: checkout → build image → push image → (опціонально) kubectl apply
- Registry: ghcr.io або Docker Hub (приклад)
  - Примітка: образи збираються та пушаться в registry CI-ом; у маніфестах потрібно вказати теги образів перед деплоєм.

---

## 5. Короткий опис дизайну (3–5 речень)
Booking-system — REST API та SPA для бронювання послуг; користувачі — клієнти та адміністратори. Сервіс живе в namespace `booking-prod`; основні компоненти — `booking-api` (Deployment, 3 репліки) та `booking-frontend` (Deployment, 2 репліки). Трафік приходить на `booking.example.com`, проходить через Load Balancer і Ingress; Ingress маршрутизує `/api` до `booking-api-svc` і `/` до `booking-frontend-svc`, а Service розподіляє трафік між Pod-ами. Перед застосуванням до кластера потрібно підставити конкретні `image` у Deployment-ах (бо у цій версії всі image видалені для вашого запиту).
