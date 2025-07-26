# Levana - Vacation Management Platform

Levana is a full-stack vacation booking and management web application built as a final project for a Full Stack Development course. The platform supports two types of users: regular users and administrators. Each user type has its own dedicated permissions and view.

---

## ✨ Project Highlights:

* Built with **React + TypeScript** on the frontend.
* **Node.js + Express + TypeScript** backend.
* Data is stored in **MongoDB**, with Mongoose ODM.
* Authentication via **JWT**.
* Full **CRUD** functionality for vacations.
* Admin-only analytics dashboard including interactive **Like Reports** and **CSV export**.
* Responsive, modern UI inspired by Airbnb / Booking.com.

---

## 💼 Functional Overview

### 📆 Regular User Features:

* View all available vacations.
* Like / Unlike vacations.
* Search vacations by price/date.
* Filter vacations by: liked, active, future.
* View like count per vacation (without editing privileges).

### 📈 Admin Features:

* Add a new vacation (with image upload).
* Edit existing vacations (all fields editable).
* Delete vacations.
* View full like report (as bar chart).
* Download like data as **CSV file**.
* Access restricted only with a valid admin JWT.

---

## ⚡ Technologies Used

### Frontend:

* React 18 + TypeScript
* Redux (manual slice management)
* Axios for HTTP communication
* React Router for navigation
* Recharts for graphical reports
* TailwindCSS + custom CSS for styling

### Backend:

* Node.js + Express
* TypeScript for strong typing
* Mongoose + MongoDB for data persistence
* JWT for authentication
* Multer/FileUpload for image handling

---

## 📖 Project Structure

```
Levana/
├── Frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── Models/
│   │   ├── Redux/
│   │   ├── Services/
│   │   ├── Utils/
├── Backend/
│   ├── src/
│   │   ├── 3-models/
│   │   ├── 4-services/
│   │   ├── 5-controllers/
│   │   ├── 6-middleware/
│   │   ├── app.ts
├── Database/
│   ├── vacations.json
├── README.md
```

---

## 🚪 Authentication & Authorization

* Users are authenticated via JWT stored in sessionStorage.
* `authService.ts` handles login, logout, token decoding, role extraction.
* Middleware on backend (`verifyLoggedIn`, `verifyAdmin`) protects sensitive routes.

---

## 📊 Reports + CSV Export

* Admins see a **bar chart** of all destinations + like counts.
* Bar color dynamically reflects popularity:

  * ⭐ High: Dark purple
  * Medium: Lavender
  * Low: Light gray
* Includes "Download CSV" button that converts the data to a `vacation-likes-report.csv` file.

---

## ⚖️ Role-Based UI

| Feature            |  User | Admin |
| ------------------ |  ---- | ----- |
| View Vacations     |  ✅   |  ✅  |
| Like/Unlike        |  ✅   |      |
| Add/Edit/Delete    |       |  ✅  |
| Access Like Report |       |  ✅  |
| Export to CSV      |       |  ✅  |

---

## 💾 Running the Project

### Backend:

```bash
cd Backend
npm install
npm start
```

### Frontend:

```bash
cd Frontend
npm install
npm start
```

> Both servers run on default ports (3000 for frontend, 4000 for backend). Ensure MongoDB is connected.

---

## 🎉 Optional Enhancements (Bonus):

* [ ] Unit tests (Jest or similar)
* [ ] Docker support
* [ ] Deployment to Cloud (e.g., Render, Vercel)

---

## 🚀 Author

**Shalev Malihi**
Final Full Stack Project, 2025
