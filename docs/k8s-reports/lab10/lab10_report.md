# Звіт до Практичної роботи 10: Kubernetes

## 1. Опис власного сервісу (Рівень 100 балів)

**Назва:** Backend API "Booking System"
**Призначення:** Управління бронюванням номерів і клієнтською базою.
**Стек:** Node.js (Express), MySQL.

**Локальний тестовий запуск:**

```bash
docker run --rm -p 8082:3000 booking-api:1.0.0
```

**Основні ендпоінти:**

* `GET /health` — перевірка працездатності
* `GET /bookings` — отримання списку бронювань

---

## 2. Процес розгортання та базовий рівень (60 балів)

### 2.1. Запуск Minikube та збірка образу

```bash
minikube start --driver=docker
minikube image build -t booking-api:1.0.0 ./backend
```

### 2.2. Застосування маніфестів

```bash
kubectl apply -f k8s/
```

**Отримано:**

* configmap/booking-config created
* secret/booking-secret created
* deployment.apps/booking-api created
* service/booking-api created
* ingress.networking.k8s.io/booking-ingress created

### 2.3. Перевірка ресурсів

```bash
kubectl get all
```

* Два поди у статусі Running
* Service типу ClusterIP

---

## 3. ConfigMap, Secrets (Рівень 75 балів)

### 3.1. Робота з ConfigMap

```bash
kubectl exec -n default <pod-name> -- env | grep APP_MODE
# APP_MODE=dev
```

* Зміни в `configmap.yaml` застосовуються через:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl rollout restart deployment booking-api
```

---

## 4. Ingress та Debug (Рівень 90 балів)

### 4.1. Увімкнення Ingress

```bash
minikube addons enable ingress
sudo minikube tunnel
```

* Додано запис у hosts:

```
127.0.0.1 booking.local
```

### 4.2. Перевірка роботи через домен

```bash
curl http://booking.local/health
# {"status":"ok"}
```

**Шлях запиту:** Client → DNS (/etc/hosts) → Minikube Tunnel → Ingress Controller → Service → Pod.

### 4.3. Перевірка self-healing

```bash
kubectl delete pod booking-api-8689cb86cb-fsrbq
kubectl get pods
```

* ReplicaSet автоматично відновив кількість подів

### 4.4. Debug-флоу

Використані команди:

```bash
kubectl describe pod <pod-name>
kubectl describe ingress booking-ingress
```

---

## 5. Контрольні запитання

a) Відмінність між ConfigMap та Secret

* **ConfigMap:** відкриті налаштування (режим роботи, URL)
* **Secret:** конфіденційні дані (паролі, токени, зберігаються у Base64)

b) Різниця між Liveness і Readiness

* **Liveness:** перевіряє, чи контейнер "живий"; перезапускає при зависанні
* **Readiness:** визначає, чи контейнер готовий приймати трафік; не перезапускає

c) Через які ресурси проходить запит

* `curl http://booking.local/health` → /etc/hosts → Minikube Tunnel → Ingress → Service → Pod

d) Як оновити env-змінні з ConfigMap

```bash
kubectl rollout restart deployment booking-api
```

e) Як було мігровано власний сервіс

* Створено Dockerfile для Node.js застосунку
* Додано Deployment (2 репліки)
* Додано Service (ClusterIP)
* Додано Ingress для доменного доступу
* MySQL піднято окремим Deployment
