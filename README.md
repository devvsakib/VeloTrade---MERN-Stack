# VeloTrade 🚀
### **Next-Gen Multi-Vendor Marketplace with High-Performance UI**

VeloTrade is a premium, feature-rich multi-vendor e-commerce platform built for scale and speed. It features a stunning glassmorphic UI, real-time analytics, secure payment gateway integrations, and a sophisticated hierarchical category system.

---

## ✨ Key Features

### 👤 Customer Experience
- **Premium UI**: Ultra-modern design with smooth Framer Motion animations.
- **Dynamic Shop Page**: Advanced filtering and search for a seamless shopping experience.
- **Secure Checkout**: Multiple payment methods including SSLCommerz, bKash, and Nagad.
- **Order Tracking**: Detailed order history and real-time status updates.
- **Invoice Downloads**: Professional PDF receipts Generated on-the-fly.
- **Personalized Dashboards**: Custom profiles, wishlists, and order management.

### 🏪 Vendor Ecosystem
- **Vendor Dashboard**: Real-time sales stats, balance tracking, and payout requests.
- **Inventory Management**: Intuitive product management with stock alerts.
- **Coupon System**: Create and manage vendor-specific or platform-wide discounts.
- **Growth Tools**: Track sales performance and manage shop identity.

### 🛡️ Admin Control Center
- **Network Hub**: Centralized system health and growth monitoring.
- **User Management**: Role-based access control (RBAC) with user activation/deactivation.
- **Vendor Verification**: Automated workflows for approving or rejecting vendor applications.
- **Hierarchy Management**: Manage deep-nested product categories (Category Tree).
- **Dispute Resolution**: Dedicated tools for handling customer refunds and shop disputes.

---

## 🛠️ Tech Stack

**Frontend:**
- [React.js](https://reactjs.org/) (Vite)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Lucide Icons](https://lucide.dev/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) (Mongoose)
- [Socket.io](https://socket.io/) (Real-time events)
- [PDFKit](http://pdfkit.org/) (Invoice Generation)
- [JWT](https://jwt.io/) (Authentication)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Yarn (v4)

### 2. Backend Setup
```bash
cd backend
yarn install
cp .env.example .env # Configure your MongoDB URI and API Keys
yarn dev
```

### 3. Frontend Setup
```bash
cd frontend
yarn install
cp .env.example .env # Point VITE_API_URL to your backend
yarn dev
```

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
| Variable | Description |
| :--- | :--- |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Secret key for auth tokens |
| `SSL_STORE_ID` | SSLCommerz Store ID |
| `BKASH_APP_KEY` | bKash API App Key |

### Frontend (`/frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_URL` | Base URL for the backend API |
| `VITE_SOCKET_URL`| URL for the real-time socket server |

---

## 🏗️ Project Structure
```text
.
├── backend/
│   ├── server/
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # Database schemas
│   │   ├── routes/        # API endpoints
│   │   └── utils/         # PDF gen, Payment, etc.
│   └── index.js           # Server entry point
├── frontend/
    ├── src/
    │   ├── admin/         # Admin-only pages
    │   ├── vendor/        # Vendor-only pages
    │   ├── components/    # Specialized UI components
    │   └── pages/         # Public/Customer pages
    └── App.jsx            # Main routing configuration
```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **Antigravity**.
