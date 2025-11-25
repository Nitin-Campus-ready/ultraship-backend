# 📦 Employee Directory Backend (GraphQL API)

Backend service for the **Employee Directory Full-Stack Assignment**.  
This server exposes a **GraphQL API** consumed by the Next.js frontend and includes pagination, filtering, sorting, and role-based access control.

---

## 🚀 Features Implemented

### ✅ GraphQL API

- Fetch all employees
- Pagination (`page`, `pageSize`)
- Sorting (by `NAME`, `AGE`, `ATTENDANCE`)
- Filters (`nameContains`, `class`, `department`, age range)
- Fetch a single employee

### ✅ Mutations

- Add employee
- Update employee
- (Delete / Flag / Edit actions are simulated on the frontend for this assignment)

### ✅ Authentication & Authorization

- JWT-based authentication
- Supported roles:
  - `ADMIN`
  - `EMPLOYEE`
- Certain mutations require **ADMIN** role
- Role is identified through `Authorization: Bearer <token>`

### ✅ Performance Patterns

- Server-side filtering
- Server-side sorting
- Server-side pagination
- Clean resolver modularity
- Easy to replace in-memory data with real database later

---

## 🛠 Tech Stack

- **Node.js (ESM)**
- **Express**
- **Apollo Server (GraphQL)**
- **JWT Authentication**
- **In-memory data storage** (required for assignment)

---

## 📁 Project Structure

```
    backend/
    │── package.json
    │── README.md
    │── src/
    │ ├── index.js # Server bootstrap (Express + Apollo)
    │ ├── /model/schema.js # GraphQL typeDefs + resolvers
    │ ├── /data/data.js # Mock in-memory employee dataset
    │ ├── /startergies/jwt-startergies.js # JWT auth utilities + role checks
```

## 📥 Installation

Clone Repo:

```bash
git clone git@github.com:Nitin-Campus-ready/ultraship-backend.git

cd ultraship-backend
```

Install dependencies:

```bash
npm install
```

Start server in dev mode:

```
npm run dev
```
