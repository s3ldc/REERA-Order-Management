# B2B Order Management System

A role-based **B2B Order Management System** built with **React, PocketBase, and Tailwind CSS**, designed to streamline order creation, assignment, tracking, and delivery across Salespersons, Distributors, and Admins.

---

## 🚀 Features

### 🔐 Authentication & Roles
- Secure authentication using **PocketBase**
- Role-based access control:
  - **Salesperson**
  - **Distributor**
  - **Admin**

---

### 🧑‍💼 Salesperson Dashboard
- Create new orders
- Assign orders to distributors
- View all created orders
- Track:
  - Order status (Pending / Dispatched / Delivered)
  - Payment status (Paid / Unpaid)
- KPI cards for quick insights:
  - Total Orders
  - Pending Orders
  - Paid Orders

---

### 🚚 Distributor Dashboard
- View only assigned orders
- Update order delivery status
- Clear visual status indicators
- Real-time updates after actions

---

### 🛠️ Admin Dashboard
- View and manage **all orders**
- Update:
  - Order status
  - Payment status
- Filter orders by:
  - Status
  - Date range
- View system-wide KPIs
- Manage users (Salespersons & Distributors)

---

### 🎨 UI / UX
- Modern, clean dashboard layout
- Tailwind CSS + shadcn/ui components
- Responsive design (desktop-first, mobile-ready)
- Consistent visual language across all dashboards
- Toast notifications for actions & errors

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Frontend     | React (Vite) |
| Styling      | Tailwind CSS, shadcn/ui |
| Backend      | PocketBase |
| Auth         | PocketBase Auth |
| Icons        | Lucide React |
| State Mgmt   | React Context API |

---

## 📁 Project Structure

```
src/
│
├── components/
│ ├── Dashboard/
│ │ ├── SalespersonDashboard.tsx
│ │ ├── DistributorDashboard.tsx
│ │ └── AdminDashboard.tsx
│ ├── ui/ # Reusable UI components
│ ├── Login.tsx
│ └── Signup.tsx
│
├── context/
│ ├── AuthContext.tsx
│ └── OrderContext.tsx
│
├── hooks/
│ └── useToast.tsx
│
├── lib/
│ └── pocketbase.ts
│
└── App.tsx

```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd <project-folder>
```
---

### 2️⃣ Install Dependencies
```bash
npm install
```

---

### 3️⃣ Start Development Server

```bash
npm run dev
```

---

### 🗄️ PocketBase Setup

1.  Download and run **PocketBase**
2.  Create collections:
    - `users`
    - `orders`
3. Required fields for `orders`:
   - `spa_name`
   - `address`
   - `product_name`
   - `quantity`
   - `status`
   - `payment_status`
   - `salesperson_id` (relation → users)
   - `distributor_id` (relation → users)
4. Assign roles in `users` collection:
   - `Admin`
   - `Salesperson`
   - `Distributor`
     
---

### 🔒 Access Control Logic

| Role | Access |
|------------|--------|
| Salesperson | Create & view own orders |
| Distributor | View assigned orders only |
| Admin | Full access (orders + users) |

---

### 🧪 Known Improvements (Planned)

- Global loading skeletons (remove first-load empty state)
- Pagination for large order lists
- Advanced search & filtering
- Sidebar navigation layout
- Audit logs for Admin actions

---

### 📌 Status

- ✅ Core functionality complete.
- 🚧 UI/UX enhancements in progress.
- 🔜 Performance & scalability improvements planned.

---

👤 Author

- Sunil Biriya
- Full Stack Developer
- Focused on building scalable, production-ready systems.
