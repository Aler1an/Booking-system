# ADR 0003 — Стиль API і формат помилок

## Рішення
- Використовується REST API.
- Формат даних — JSON.
- Помилки повертаються у форматі ErrorResponse:
```json
{
  "error": "ValidationError",
  "code": "FIELD_REQUIRED",
  "details": [{ "field": "title", "message": "Title is required" }]
}