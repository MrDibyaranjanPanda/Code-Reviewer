# AI Code Review Assistant — API Documentation

## 1. API Overview

The AI Code Review Assistant backend provides REST APIs for user authentication, project management, Python file uploads, automated code analysis, review retrieval, PDF report generation, and dashboard statistics.

### Base URL

```text
http://127.0.0.1:5000
```

> Replace the base URL with the deployed backend URL when the application is deployed.

---

## 2. Authentication

The API uses **JSON Web Tokens (JWT)** for authentication.

After a successful login, the API returns an `access_token`.

For protected endpoints, include the token in the request header:

```text
Authorization: Bearer <access_token>
```

### Protected Endpoints

All endpoints marked as **Protected** require a valid JWT access token.

---

# 3. Authentication APIs

## 3.1 Register User

Creates a new user account.

### Request

```http
POST /auth/register
```

### Authentication

Not required.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Request Parameters

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| `name`     | String | Yes      | User's name          |
| `email`    | String | Yes      | User's email address |
| `password` | String | Yes      | User's password      |

### Success Response

**Status Code: `201 Created`**

```json
{
  "message": "User registered successfully"
}
```

### Error Response

**Status Code: `400 Bad Request`**

```json
{
  "error": "Email already exists"
}
```

---

## 3.2 Login User

Authenticates a user and returns a JWT access token.

### Request

```http
POST /auth/login
```

### Authentication

Not required.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Request Parameters

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `email`    | String | Yes      | Registered email address |
| `password` | String | Yes      | User's password          |

### Success Response

**Status Code: `200 OK`**

```json
{
  "message": "Login successful",
  "access_token": "<JWT_TOKEN>"
}
```

### Error Response

**Status Code: `401 Unauthorized`**

```json
{
  "error": "Invalid email or password"
}
```

---

## 3.3 Get User Profile

Returns the profile information of the authenticated user.

### Request

```http
GET /auth/profile
```

### Authentication

**Protected**

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "user_id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Error Response

**Status Code: `404 Not Found`**

```json
{
  "error": "User not found"
}
```

---

# 4. Project APIs

## 4.1 Create Project

Creates a new code review project for the authenticated user.

### Request

```http
POST /projects
```

### Authentication

**Protected**

### Headers

```text
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Body

```json
{
  "project_name": "My Python Project",
  "upload_type": "python"
}
```

### Request Parameters

| Field          | Type   | Required | Description         |
| -------------- | ------ | -------- | ------------------- |
| `project_name` | String | Yes      | Name of the project |
| `upload_type`  | String | No       | Type of upload      |

### Success Response

**Status Code: `201 Created`**

```json
{
  "message": "Project created successfully"
}
```

### Error Response

**Status Code: `400 Bad Request`**

```json
{
  "error": "Project name is required"
}
```

---

## 4.2 Get User Projects

Returns all projects belonging to the authenticated user.

### Request

```http
GET /projects
```

### Authentication

**Protected**

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
[
  {
    "id": 1,
    "project_name": "My Python Project",
    "upload_type": "python",
    "created_at": "2026-07-19T10:00:00"
  }
]
```

### Response Fields

| Field          | Type     | Description                |
| -------------- | -------- | -------------------------- |
| `id`           | Integer  | Project ID                 |
| `project_name` | String   | Project name               |
| `upload_type`  | String   | Upload type                |
| `created_at`   | DateTime | Project creation timestamp |

---

## 4.3 Get Project Files

Returns all uploaded files associated with a project.

### Request

```http
GET /projects/{project_id}/files
```

### Authentication

**Protected**

### Path Parameters

| Parameter    | Type    | Description       |
| ------------ | ------- | ----------------- |
| `project_id` | Integer | ID of the project |

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "files": [
    {
      "id": 1,
      "filename": "example.py",
      "uploaded_at": "2026-07-19T10:05:00"
    }
  ]
}
```

### Error Response

**Status Code: `404 Not Found`**

```json
{
  "error": "Project not found or access denied"
}
```

---

## 4.4 Delete Uploaded File

Deletes an uploaded Python file and its associated review.

### Request

```http
DELETE /files/{file_id}
```

### Authentication

**Protected**

### Path Parameters

| Parameter | Type    | Description             |
| --------- | ------- | ----------------------- |
| `file_id` | Integer | ID of the uploaded file |

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "message": "File deleted successfully"
}
```

### Error Responses

**Status Code: `404 Not Found`**

```json
{
  "error": "File not found"
}
```

**Status Code: `403 Forbidden`**

```json
{
  "error": "Access denied"
}
```

---

## 4.5 Delete Project

Deletes a project and its associated uploaded files and reviews.

### Request

```http
DELETE /projects/{project_id}
```

### Authentication

**Protected**

### Path Parameters

| Parameter    | Type    | Description       |
| ------------ | ------- | ----------------- |
| `project_id` | Integer | ID of the project |

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "message": "Project deleted successfully"
}
```

### Error Response

**Status Code: `404 Not Found`**

```json
{
  "error": "Project not found or access denied"
}
```

---

# 5. Code Upload and Analysis APIs

## 5.1 Upload Python File

Uploads a Python file to a project and automatically performs code analysis.

### Request

```http
POST /upload/{project_id}
```

### Authentication

**Protected**

### Path Parameters

| Parameter    | Type    | Description       |
| ------------ | ------- | ----------------- |
| `project_id` | Integer | ID of the project |

### Headers

```text
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Form Data

| Field  | Type | Required | Description        |
| ------ | ---- | -------- | ------------------ |
| `file` | File | Yes      | Python source file |

### Example

```text
file: example.py
```

### Analysis Pipeline

After upload, the backend performs the following analysis:

1. Reads the Python source code.
2. Runs Pylint analysis.
3. Runs Bandit security analysis.
4. Runs Radon code quality analysis.
5. Sends the code for AI-powered review.
6. Combines all results.
7. Stores the review in the database.

### Success Response

**Status Code: `201 Created`**

```json
{
  "message": "File uploaded successfully",
  "review": {
    "pylint": [],
    "bandit": {
      "results": []
    },
    "radon": {},
    "ai_review": {
      "score": 85,
      "severity": "Low",
      "summary": "The code is generally well structured.",
      "issues": []
    }
  }
}
```

> The exact analysis result fields may vary depending on the output returned by the analysis tools and AI review service.

### Error Response

**Status Code: `400 Bad Request`**

```json
{
  "error": "No file uploaded"
}
```

### No File Selected

```json
{
  "error": "No file selected"
}
```

---

# 6. Review APIs

## 6.1 Get Review for an Uploaded File

Returns the complete code review for a specific uploaded file.

### Request

```http
GET /review/{uploaded_file_id}
```

### Authentication

**Protected**

### Path Parameters

| Parameter          | Type    | Description             |
| ------------------ | ------- | ----------------------- |
| `uploaded_file_id` | Integer | ID of the uploaded file |

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "uploaded_file_id": 1,
  "review": {
    "pylint": [],
    "bandit": {
      "results": []
    },
    "radon": {},
    "ai_review": {}
  },
  "created_at": "2026-07-19T10:10:00"
}
```

### Error Responses

**Status Code: `404 Not Found`**

```json
{
  "error": "File not found"
}
```

```json
{
  "error": "Review not found"
}
```

**Status Code: `403 Forbidden`**

```json
{
  "error": "Access denied"
}
```

---

## 6.2 Get All Reviews

Returns a summary of all reviews associated with the authenticated user's projects.

### Request

```http
GET /reviews
```

### Authentication

**Protected**

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
[
  {
    "review_id": 1,
    "uploaded_file_id": 1,
    "filename": "example.py",
    "project_name": "My Python Project",
    "created_at": "2026-07-19T10:10:00",
    "score": 85,
    "severity": "Low"
  }
]
```

### Response Fields

| Field              | Type     | Description                 |
| ------------------ | -------- | --------------------------- |
| `review_id`        | Integer  | Review ID                   |
| `uploaded_file_id` | Integer  | Uploaded file ID            |
| `filename`         | String   | Uploaded file name          |
| `project_name`     | String   | Associated project name     |
| `created_at`       | DateTime | Review creation timestamp   |
| `score`            | Number   | AI-generated review score   |
| `severity`         | String   | AI-generated severity level |

---

## 6.3 Download Review PDF

Generates and downloads a PDF report for a code review.

### Request

```http
GET /review/{file_id}/pdf
```

### Authentication

**Protected**

### Path Parameters

| Parameter | Type    | Description             |
| --------- | ------- | ----------------------- |
| `file_id` | Integer | ID of the uploaded file |

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

Returns a PDF file.

### Response Headers

```text
Content-Type: application/pdf
Content-Disposition: attachment; filename=code_review_<file_id>.pdf
```

### Error Response

The API returns a JSON error response if PDF generation fails or the requested review cannot be found.

---

# 7. Dashboard APIs

## 7.1 Get Dashboard Statistics

Returns aggregated statistics for the authenticated user.

### Request

```http
GET /dashboard/stats
```

### Authentication

**Protected**

### Headers

```text
Authorization: Bearer <access_token>
```

### Success Response

**Status Code: `200 OK`**

```json
{
  "total_projects": 5,
  "total_reviews": 12,
  "total_issues": 27
}
```

### Response Fields

| Field            | Type    | Description                                             |
| ---------------- | ------- | ------------------------------------------------------- |
| `total_projects` | Integer | Total number of projects owned by the user              |
| `total_reviews`  | Integer | Total number of reviews created for the user's projects |
| `total_issues`   | Integer | Total Pylint and Bandit issues detected                 |

---

# 8. API Endpoint Summary

| Method   | Endpoint                       | Authentication | Description                      |
| -------- | ------------------------------ | -------------- | -------------------------------- |
| `GET`    | `/`                            | No             | Backend health/status message    |
| `POST`   | `/auth/register`               | No             | Register a new user              |
| `POST`   | `/auth/login`                  | No             | Authenticate user and return JWT |
| `GET`    | `/auth/profile`                | Yes            | Get authenticated user profile   |
| `POST`   | `/projects`                    | Yes            | Create a project                 |
| `GET`    | `/projects`                    | Yes            | Get user's projects              |
| `GET`    | `/projects/{project_id}/files` | Yes            | Get project files                |
| `DELETE` | `/files/{file_id}`             | Yes            | Delete an uploaded file          |
| `DELETE` | `/projects/{project_id}`       | Yes            | Delete a project                 |
| `POST`   | `/upload/{project_id}`         | Yes            | Upload and analyze Python code   |
| `GET`    | `/review/{uploaded_file_id}`   | Yes            | Get a complete code review       |
| `GET`    | `/reviews`                     | Yes            | Get all review summaries         |
| `GET`    | `/review/{file_id}/pdf`        | Yes            | Download a review PDF            |
| `GET`    | `/dashboard/stats`             | Yes            | Get dashboard statistics         |

---

# 9. Standard HTTP Status Codes

| Status Code                 | Meaning                                             |
| --------------------------- | --------------------------------------------------- |
| `200 OK`                    | Request completed successfully                      |
| `201 Created`               | Resource created successfully                       |
| `400 Bad Request`           | Invalid or incomplete request                       |
| `401 Unauthorized`          | Authentication failed or JWT is invalid             |
| `403 Forbidden`             | User does not have access to the requested resource |
| `404 Not Found`             | Requested resource was not found                    |
| `500 Internal Server Error` | Unexpected server-side error                        |

---

# 10. Example API Workflow

A typical code review workflow is:

```text
1. Register user
        ↓
2. Login and receive JWT token
        ↓
3. Create a project
        ↓
4. Upload a Python file
        ↓
5. Automated analysis is performed
        ↓
6. Review is stored in the database
        ↓
7. Retrieve the review
        ↓
8. Download the review as a PDF
```
