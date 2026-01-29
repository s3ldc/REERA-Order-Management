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


