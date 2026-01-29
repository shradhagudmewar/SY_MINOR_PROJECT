# Alumni Connect Backend

Backend API for the Alumni Connect frontend (auth + mentors listing).

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication

## Endpoints used by the frontend

- **POST** `/api/auth/register`
  - Body: `{ fullName, email, password, phone, department, year, role, graduationYear? }`
  - Returns: `{ success, message, data: { token, user } }`

- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ success, message, data: { token, user } }`

- **GET** `/api/users?role=alumni&department=&batch=&company=`
  - Filters:
    - `role` – typically `alumni`
    - `department` – exact match
    - `batch` – matches `graduationYear` or `year`
    - `company` – partial, case-insensitive match on `currentCompany`
  - Returns: `{ success, data: [users] }`

## Getting started

1. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**

   - Copy `.env.example` to `.env` and adjust values if needed:

   ```bash
   cp .env.example .env   # On Windows PowerShell: copy .env.example .env
   ```

3. **Start MongoDB**

   - Make sure MongoDB is running locally, or set `MONGODB_URI` in `.env` to a MongoDB Atlas URI.

4. **Run the server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000/api`, which matches the `API_URL` in `script.js`.

5. **Open the frontend**

   - Open `index.html` (or other pages) in a browser.
   - The frontend will call this backend for:
     - Registration / login (auth modal)
     - Loading mentors on the communities/mentors page.

