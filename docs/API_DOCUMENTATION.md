# API Documentation

Base URL (local): `http://localhost:5000/api`
All bodies are JSON. Admin routes need the header `x-admin-key: <ADMIN_API_KEY from server/.env>`.

## Response format
Success: `{ "success": true, "data": ..., "message": "..." }`
Error: `{ "success": false, "message": "...", "errors": { "field": "problem" } }` (`errors` only for validation)

## Endpoints
| Method | Endpoint | Auth | Success | Errors |
|---|---|---|---|---|
| GET | `/health` | none | 200 | |
| POST | `/enquiries` | none | 201 | 400 validation, 429 rate limit |
| GET | `/enquiries` | admin | 200 | 401, 400 bad filter |
| GET | `/enquiries/:id` | admin | 200 | 401, 400 invalid ID, 404 not found |
| PUT | `/enquiries/:id` | admin | 200 | 400, 401, 404 |
| PATCH | `/enquiries/:id` | admin | 200 | 400, 401, 404 |
| DELETE | `/enquiries/:id` | admin | 200 | 400, 401, 404 |

Any server/database failure returns 500 with a generic message (details only in the server log).

## Enquiry fields
`name` (2-80), `email`, `phone` (10-13 digits), `userType` (Student | Customer | Other), `interest`, `message` (5-1000). `status` is `New` on creation and can be changed with PUT/PATCH to `New`, `Contacted`, `In Progress` or `Closed`.

## GET /enquiries query parameters
`search` (name or email, partial match), `userType`, `status`, `page` (default 1), `limit` (default 50, max 100; the dashboard uses 20).

## Test with PowerShell
Use `Invoke-RestMethod` (in PowerShell, plain `curl` is an alias and behaves differently).

```powershell
$base = "http://localhost:5000/api"
$h = @{ "x-admin-key" = "YOUR_ADMIN_API_KEY" }

# Create (public)
$body = @{ name="Test User"; email="test@example.com"; phone="+91 9876543210"; userType="Student"; interest="Course: Drone Pilot Fundamentals"; message="Please contact me." } | ConvertTo-Json
$new = Invoke-RestMethod -Method Post -Uri "$base/enquiries" -ContentType "application/json" -Body $body
$id = $new.data._id

# List / search / filter
Invoke-RestMethod -Uri "$base/enquiries" -Headers $h
Invoke-RestMethod -Uri "$base/enquiries?search=test&userType=Student" -Headers $h

# Get one
Invoke-RestMethod -Uri "$base/enquiries/$id" -Headers $h

# Update status (PATCH)
Invoke-RestMethod -Method Patch -Uri "$base/enquiries/$id" -Headers $h -ContentType "application/json" -Body '{"status":"Contacted"}'

# Delete
Invoke-RestMethod -Method Delete -Uri "$base/enquiries/$id" -Headers $h
```

### Error examples to show in the video
```powershell
# 400 validation error (invalid email + phone). PowerShell throws on 4xx, so print the body:
try { Invoke-RestMethod -Method Post -Uri "$base/enquiries" -ContentType "application/json" -Body '{"name":"A","email":"bad","phone":"12"}' } catch { $_.ErrorDetails.Message }

# 401 without admin key
try { Invoke-RestMethod -Uri "$base/enquiries" } catch { $_.ErrorDetails.Message }

# 400 invalid ID, and 404 non-existing ID
try { Invoke-RestMethod -Uri "$base/enquiries/123" -Headers $h } catch { $_.ErrorDetails.Message }
try { Invoke-RestMethod -Uri "$base/enquiries/64b7f0f4f4d3a2b1c8e4a111" -Headers $h } catch { $_.ErrorDetails.Message }
```
You can also import these requests into Postman manually (set header `x-admin-key`).
