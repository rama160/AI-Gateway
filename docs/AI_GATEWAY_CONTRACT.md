# AI Gateway Contract

## Endpoint

`POST /v1/ai/chat`

## Authentication

`Authorization: Bearer <Google ID token>`

## Request

```json
{
  "messages": [
    {"role": "user", "text": "Halo"}
  ],
  "temperature": 0.2,
  "maxOutputTokens": 1024
}
```

## Success

```json
{
  "requestId": "uuid",
  "model": "configured-model",
  "text": "...",
  "latencyMs": 1234
}
```

## Error

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "..."
  },
  "requestId": "uuid"
}
```

The Android client must treat `503 ALL_MODELS_UNAVAILABLE` as a temporary service failure and present a safe retry message. It must not expose provider credentials.
