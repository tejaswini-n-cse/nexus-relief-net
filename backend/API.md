# ResQNet — FastAPI + PostgreSQL backend blueprint

The frontend reads from `src/data/mock.ts`, which mirrors these contracts 1:1.
Swap the mock module for a fetch client and no UI code changes.

## Auth (JWT: access 15m, refresh 7d)
```
POST /api/v1/auth/signup           {name,email,password,role}
POST /api/v1/auth/login            -> {access_token, refresh_token, role}
POST /api/v1/auth/refresh
POST /api/v1/auth/verify-email     {token}
POST /api/v1/auth/forgot-password  {email}
POST /api/v1/auth/reset-password   {token, password}
GET  /api/v1/auth/me
```
RBAC dependency: `require_role("government", "admin")`.

## Core resources
```
GET/POST     /api/v1/disasters            GET /api/v1/disasters/{id}
GET/POST     /api/v1/requests             PATCH /api/v1/requests/{id}/status
POST         /api/v1/requests/{id}/media
POST         /api/v1/sos                  {lat,lng,accuracy}
GET/POST     /api/v1/missions             PATCH /api/v1/missions/{id}
GET          /api/v1/shelters             PATCH /api/v1/shelters/{id}/occupancy
GET/PATCH    /api/v1/hospitals/{id}/capacity
GET/POST     /api/v1/inventory            POST /api/v1/distributions
GET/POST     /api/v1/volunteers
GET/POST     /api/v1/alerts               (broadcast: government/admin only)
GET          /api/v1/analytics/overview | /heatmap | /response-times
WS           /ws/notifications
```

## AI modules
```
POST /api/v1/ai/damage      {media_url}       -> {damage_grade, confidence}
POST /api/v1/ai/severity    {disaster_id}     -> {score, horizon_hours}
POST /api/v1/ai/priority    {request_ids[]}   -> [{id, score}]
POST /api/v1/ai/allocation  {district}        -> [{warehouse, camp, items}]
POST /api/v1/ai/chat        {messages[]}      -> stream
POST /api/v1/ai/summary     {disaster_id}     -> {sitrep}
```
Each returns a deterministic heuristic fallback when no model is attached.
