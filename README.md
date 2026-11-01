Rating System
A web app where users can rate registered stores from 1 to 5 stars. Everyone uses one login page, and available features depend on the user's role: System Administrator, Normal User or Store Owner.

Tech stack
Part	Technology
Backend	Node.js, Express.js
Database	MySQL (`mysql2`)
Frontend	React (Vite), React Router, Axios
Authentication	JWT, bcrypt password hashing
Validation	`express-validator` on backend, matching rules on frontend

Features
System Administrator
Dashboard with total users, stores, ratings, ratings per store and quick links.
Add users (Normal User, Store Owner or Admin) with name, email, password, address and role.
Add stores and assign an owner.
View stores (name, email, address, average rating) and users (name, email, address, role).
Filter lists by name, email, address and role.
View user details, including a Store Owner's store rating.
Change password and log out.

Normal User
Register with name, email, address and password, then log in.
View and search stores by name or address.
See each store's average rating and the rating they gave.
Submit or update a 1–5 star rating.
Change password and log out.

Store Owner
Log in with an account created by the admin.
Dashboard showing the store's average rating and users who rated it.
Change password and log out.
Tables can be sorted ascending or descending by clicking column headers.

Demo accounts
Role	Email	Password
System Administrator	`admin@example.com`	`Admin@1234`
Normal User	`suhasini@gmail.com`	`@uhasiniPillay`
Store Owner	`akhil@gmail.com`	`@khilJagtap`
Only the admin is created by the seed command. Create the other two accounts using First-time demo setup below.

Getting started
Requirements
Node.js 18 or newer
MySQL 8 installed and running
1. Backend
```bash
cd backend
copy .env.example .env      # Mac/Linux: cp .env.example .env
```
Fill in the new `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306                 # use your MySQL port, e.g. 3307, if different
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rating_system
JWT_SECRET=a_long_random_string
JWT_EXPIRES_IN=8h
CLIENT_ORIGIN=http://localhost:5173

# used only by "npm run seed"
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
```
Generate a strong `JWT_SECRET` and paste the output into `.env`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Don't commit or share `.env` (it's in `.gitignore`); share `.env.example` instead.
Run the backend commands:
```bash
npm install
npm run db:init     # creates the database and 3 tables from schema.sql
npm run seed        # creates the admin account
npm run dev         # API at http://localhost:5000
```
2. Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev         # app at http://localhost:5173
```
Open http://localhost:5173 in your browser and keep both terminals running.

First-time demo setup
Names must be 20–60 characters long, so use the examples below:
Log in as admin: `admin@example.com` / `Admin@1234`.
Go to Users > Add user:
Name: `Akhil Jagtap Store Owner`
Email: `akhil@gmail.com`
Password: `@khilJagtap`
Role: Store Owner
Go to Stores > Add store:
Name: `Akhil Jagtap General Store`
Email: any (e.g. `store@akhilstore.com`)
Address: any
Owner: Akhil
Log out, choose Create an account, and register:
Name: `Suhasini Pillay Demo User`
Email: `suhasini@gmail.com`
Password: `@uhasiniPillay`
Log in as Suhasini, find the store and rate it.
Log in as Akhil to view the average rating and users who rated the store.


How it works
Login and roles
Everyone uses the same login page. The backend checks the email and password (stored as a bcrypt hash), then returns a JWT containing the user's ID and role. The frontend keeps the token and sends it with each request. Backend routes check the token and role, so a Normal User can't access admin routes. Protected frontend routes direct users to the correct page: admin dashboard, store list or owner dashboard.
Ratings
Ratings are integers from 1 to 5 stored in `ratings`. Each user can rate a store once; submitting again updates that rating. A store's average is calculated by the database query and rounded to one decimal place.
Search, filter and sort

Only approved columns can be sorted, and SQL values are passed as parameters to help prevent SQL injection.
Validation
The browser checks these rules for quick feedback, and the server checks them again:
Field	Rule
Name	20–60 characters
Address	Maximum 400 characters
Password	8–16 characters; at least one uppercase letter and one special character
Email	Valid email format
Rating	Whole number from 1 to 5



Troubleshooting
Access denied for user 'root': Check `DB_USER` and `DB_PASSWORD` in `backend/.env`.
`connect ECONNREFUSED` during `npm run db:init`: MySQL may be stopped or `DB_PORT` is wrong. Default is 3306; use your port (e.g. 3307) in `.env`.
"Data too long for column 'name'": The database may have an older, smaller name column. Run this in MySQL, or drop the database and run `npm run db:init` again:
```sql
  USE rating_system;
  ALTER TABLE users  MODIFY name VARCHAR(60) NOT NULL;
  ALTER TABLE stores MODIFY name VARCHAR(60) NOT NULL;
  ```
`.env` changes not applied: Restart the backend; it reads `.env` on startup.
Login fails or network errors appear: Make sure the backend is running on port 5000.
`JWT_SECRET` is not set: Create `backend/.env` from `.env.example`.

"This owner already has a store": Each Store Owner can have only one store.
No owners in Add store dropdown: Create a Store Owner first. Owners with an assigned store aren't listed.
Name rejected: Names must be 20–60 characters.
npm audit warnings after install: These may come from development tools. Avoid `npm audit fix --force`, as it can break the project.