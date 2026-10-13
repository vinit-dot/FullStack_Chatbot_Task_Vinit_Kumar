# Database setup (MongoDB, local)

Database name: `dronetv_assistant`  |  Collection: `enquiries` (created automatically by Mongoose)

## 1. Start MongoDB on Windows
- Installed with the MongoDB MSI installer: MongoDB runs as a Windows service named **MongoDB**.
  Check in PowerShell: `Get-Service MongoDB` (Status should be *Running*). Start it with `Start-Service MongoDB` (PowerShell as Administrator).
- Open **MongoDB Compass** and connect to `mongodb://127.0.0.1:27017`.

## 2. Connection string
Put this in `server/.env` (never commit that file):
```
MONGODB_URI=mongodb://127.0.0.1:27017/dronetv_assistant
```

## 3. Enquiry document (schema)
| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | String | required, 2-80 chars |
| `email` | String | required, valid email, stored lowercase |
| `phone` | String | required, 10-13 digits (optional +, spaces, dashes) |
| `userType` | String | required: `Student`, `Customer`, `Other` |
| `interest` | String | required, service or course of interest |
| `message` | String | required, 5-1000 chars |
| `status` | String | `New` (default), `Contacted`, `In Progress`, `Closed` |
| `createdAt`, `updatedAt` | Date | automatic timestamps |

Indexes: `createdAt` (descending), `name + email`.

## 4. Sample data (optional)
From the `server` folder run `npm run seed` to insert 4 sample enquiries.
To remove them later, delete them from the admin dashboard or from Compass.
