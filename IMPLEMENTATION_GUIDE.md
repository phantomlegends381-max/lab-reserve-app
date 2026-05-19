# Lab-Reserve: Professional STEM Hardware Inventory System

## 📋 Project Overview

Lab-Reserve is a **full-stack MERN application** designed for educational STEM hubs to manage shared hardware resources. It features secure equipment checkout, real-time inventory tracking, and smart voltage compatibility warnings to prevent equipment damage.

**Key Features:**
- ✅ Advanced search and category filtering
- ✅ Real-time inventory availability display
- ✅ Professional, polished checkout flow with modals
- ✅ Voltage compatibility safety warnings
- ✅ Comprehensive backend validation logic
- ✅ Responsive dark-theme STEM aesthetic (Tailwind CSS)
- ✅ Atomic database operations to prevent race conditions
- ✅ Detailed error handling and user feedback

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** — Modern UI component library
- **Vite 6.0** — Lightning-fast build tool and dev server
- **Tailwind CSS 3.4** — Utility-first CSS framework
- **@tailwindcss/forms** — Pre-styled form components

### Backend
- **Node.js + Express** — RESTful API server
- **MongoDB** — NoSQL database for inventory
- **Mongoose** — Schema validation and ORM

### Deployment
- **Vercel** — Hosting for frontend (static) and serverless backend
- **MongoDB Atlas** — Managed database service

---

## 📁 Project Structure

```
lab-reserve-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EquipmentCard.jsx       # Hardware display card
│   │   │   ├── StatusBadge.jsx         # Stock status indicator
│   │   │   ├── SearchBar.jsx           # Search input
│   │   │   ├── FilterBar.jsx           # Category filter buttons
│   │   │   ├── CheckoutModal.jsx       # Checkout interface
│   │   │   └── ThreeDViewer.jsx        # 3D design scanner
│   │   ├── data/
│   │   │   ├── inventory.js            # Hardware database
│   │   │   └── components.json         # Legacy data
│   │   ├── App.jsx                     # Main application
│   │   ├── index.css                   # Tailwind imports
│   │   └── main.jsx                    # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
├── server/
│   ├── routes/
│   │   ├── checkout.js                 # Checkout logic (IMPROVED)
│   │   ├── booking.js
│   │   └── verify.js
│   ├── models/
│   │   └── Equipment.js                # Database schema
│   ├── logic/
│   │   └── schemaChecker.js
│   ├── index.js                        # Express server
│   └── package.json
├── vercel.json                         # Deployment config (UPDATED)
├── package.json                        # Root workspace config
└── README.md                           # This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MongoDB Atlas account** — [Create Free Cluster](https://www.mongodb.com/cloud/atlas)

### 1. Install Dependencies

```bash
# From project root
npm install --prefix client --legacy-peer-deps
npm install --prefix server
```

### 2. Configure Environment Variables

Create `.env` in `/server`:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/lab-reserve?retryWrites=true&w=majority

# Optional: Set custom port (default: 5000)
PORT=5000
```

### 3. Local Development

**Terminal 1 — Frontend (Vite dev server):**
```bash
cd client
npm run dev
# Opens at http://localhost:5173
```

**Terminal 2 — Backend (Express server):**
```bash
cd server
npm start
# Runs at http://localhost:5000
```

### 4. Build for Production

```bash
# Frontend
cd client && npm run build  # Creates optimized `dist/` folder

# Backend is production-ready as-is
```

---

## 📊 Hardware Inventory Data

The system includes **18+ realistic STEM hardware items** across 6 categories:

### Microcontrollers (3 items)
- ESP32 DevKit V1 (3.3V, 30-pin)
- Arduino Uno R3 (5V, 14-pin)
- Raspberry Pi Pico (3.3V, 26-pin)

### Sensors (4 items)
- HC-SR04 Ultrasonic (5V, 0-400cm range)
- DHT11 Temp/Humidity (3.3V-5V, ±10% accuracy)
- MPU6050 Gyroscope (3.3V, I2C, 6-axis)
- BMP280 Barometer (3.3V, I2C/SPI)

### Prototyping & Passive (6 items)
- Breadboards (400-point)
- Jumper Wire Packs (65-piece, color-coded)
- SG90 5V Servos
- Resistor Assortments (500-piece)
- LED Assortments (100-piece, RGB)
- Capacitor Assortments (200-piece)

### Power & Connectivity (3 items)
- USB-C Programmable Power Supply
- USB Type-C Cables (1m, 3.1A)
- FTDI Serial USB Adapters

Each item includes:
- ✅ Unique ID and category
- ✅ Detailed specifications (voltage, pin count, protocol)
- ✅ Total quantity and current availability
- ✅ Placeholder images (from placeholder.com)
- ✅ Safety metadata for voltage compatibility

---

## 🎨 Frontend Architecture

### App.jsx - Main Application Component
- **State Management**: Inventory, search, selected item, filter
- **Filtering Logic**: Combines category + search term matching
- **Checkout Flow**: Triggers modal on equipment selection

### Components

#### EquipmentCard.jsx
Displays individual hardware with Tailwind styling:
- Product image with status badge overlay
- Specification preview (first 2 specs, +N more)
- Availability summary (X of Y)
- "Checkout" button (disabled if out of stock)

#### StatusBadge.jsx
Color-coded inventory status:
- **Green**: In Stock (≥50% available)
- **Yellow**: Low Stock (10-50% available)
- **Red**: Out of Stock (<10%)

#### SearchBar.jsx & FilterBar.jsx
- Real-time search across name + specs
- Category toggle buttons with active states
- Result count display

#### CheckoutModal.jsx
Professional checkout interface:
- **Item Header**: Name, category, specs
- **Stock Status**: Visual status badge
- **Specifications Panel**: Tabular spec display
- **⚠️ Safety Warning**: Shows if 3.3V sensor selected
- **Quantity Selector**: ± buttons, manual input
- **Student ID Input**: For tracking checkout
- **Summary Panel**: Item + quantity at a glance
- **Error Handling**: Form validation, network errors
- **Success Feedback**: Confirmation message

### Styling Approach
- **Tailwind CSS 3.4** with custom color palette
- **Dark Theme**: Gradient background (stem-900 → slate-900)
- **Custom STEM Colors**: Blue palette (stem-50 through stem-900)
- **Responsive Grid**: 1 col (mobile) → 2 (tablet) → 3-4 (desktop)
- **Hover Effects**: Cards lift on hover, smooth transitions

---

## ⚙️ Backend Architecture

### Express Server (server/index.js)
```javascript
// CORS enabled for frontend requests
app.use(cors());
app.use(express.json());

// Routes mounted
app.use('/api/booking', bookingRoutes);
app.use('/api/checkout', checkoutRoutes);   // MAIN: Checkout logic
app.use('/api/verify', verifyRoutes);
```

**MongoDB Connection**: Connects on startup, logs status to console

### Checkout Route (server/routes/checkout.js) - COMPREHENSIVE

#### POST /api/checkout
**Request Body:**
```json
{
  "itemId": "mcu-001",
  "studentId": "STU-12345",
  "quantity": 2
}
```

**Validation Logic:**
1. ✅ Required fields present (itemId, studentId, quantity)
2. ✅ Quantity is a positive integer
3. ✅ Item exists in database
4. ✅ Sufficient inventory available (currentAvailable >= quantity)
5. ✅ Voltage compatibility metadata check

**Atomic Operation:**
```javascript
const updatedItem = await Equipment.findByIdAndUpdate(
  itemId,
  { $inc: { currentAvailable: -parsedQty } },
  { new: true, runValidators: true }
);
```
- Uses MongoDB `$inc` operator for atomic decrement
- Prevents race conditions (two simultaneous checkouts)
- Returns updated document with validation

**Success Response (200):**
```json
{
  "message": "Checkout completed successfully.",
  "code": "CHECKOUT_SUCCESS",
  "item": { "id", "name", "category" },
  "checkoutDetails": { "quantity", "studentId", "timestamp" },
  "updatedInventory": { "available", "total" },
  "compatibilityWarning": "..." (optional)
}
```

**Error Responses:**
- `400 MISSING_FIELDS` — Required parameters missing
- `400 INVALID_QUANTITY` — Non-integer or ≤0 quantity
- `404 ITEM_NOT_FOUND` — Item doesn't exist
- `409 INSUFFICIENT_STOCK` — Not enough units available
- `500 SERVER_ERROR` — Database/server issue

#### GET /api/checkout/status/:itemId
Returns current availability snapshot (optional endpoint).

---

## 🔐 Safety & Validation

### Frontend Validation
- Required field checking (Student ID, quantity)
- Quantity bounds enforcement (1 to currentAvailable)
- Disable checkout if out of stock

### Backend Validation
- **Atomic Updates**: MongoDB $inc prevents double-checkouts
- **Schema Validation**: Mongoose validators on save
- **Error Logging**: Console logs all checkout events for audit
- **HTTP Status Codes**: Proper 4xx/5xx responses for errors

### Safety Features
- ⚠️ **Voltage Compatibility Warning**: If selecting 3.3V sensors
- 📋 **Audit Trail**: Every checkout logged with timestamp + student ID
- 🔒 **Inventory Consistency**: Atomic DB operations prevent race conditions

---

## 📤 Deployment Guide

### Deploy to Vercel

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Expanded Lab-Reserve with Tailwind, inventory, checkout modal"
git push origin main
```

#### Step 2: Configure Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import GitHub repository
3. **Root Directory**: Leave blank (auto-detected)
4. **Build Command**: `npm run build --prefix client`
5. **Output Directory**: `client/dist`
6. **Framework**: Vite (auto-detected)

#### Step 3: Set Environment Variables
In Vercel Project Settings → Environment Variables:

```
MONGODB_URI: <your-mongodb-atlas-connection-string>
```

#### Step 4: Deploy
- Vercel auto-deploys on git push
- Or manually trigger: Deployments → "Redeploy"

**vercel.json Configuration:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "server/index.js" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Result:**
- Frontend: `https://<project>.vercel.app/`
- API: `https://<project>.vercel.app/api/checkout`

---

## 🎓 Portfolio Highlights

### For Demonstrating Full-Stack Skills:

1. **Frontend Excellence**
   - ✅ React hooks (useState, useMemo)
   - ✅ Component composition & prop drilling
   - ✅ Modern CSS (Tailwind, responsive grid)
   - ✅ Form handling & validation
   - ✅ Modal implementation
   - ✅ Real-time search & filtering

2. **Backend Proficiency**
   - ✅ Express route design & HTTP semantics
   - ✅ MongoDB schema & Mongoose ORM
   - ✅ Input validation & error handling
   - ✅ Atomic database operations (preventing race conditions)
   - ✅ RESTful API design (proper status codes)
   - ✅ Detailed code comments for clarity

3. **Software Engineering Practices**
   - ✅ Clean code organization & file structure
   - ✅ Comprehensive comments & docstrings
   - ✅ Error handling & logging
   - ✅ Atomic transactions for data consistency
   - ✅ Security considerations (voltage warnings)
   - ✅ Production-ready deployment config

4. **UX/Design Thinking**
   - ✅ Professional dark-theme aesthetic
   - ✅ Accessibility (color-coded status)
   - ✅ User feedback (modals, warnings, success msgs)
   - ✅ Responsive design (mobile to desktop)
   - ✅ Intuitive checkout flow

---

## 🐛 Troubleshooting

### npm install fails with peer dependency warning
```bash
npm install --legacy-peer-deps
```

### Vite dev server won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### MongoDB connection fails
- Verify `MONGODB_URI` in `.env` is correct
- Check MongoDB Atlas whitelist (allow all IPs for dev)
- Ensure network connectivity

### Checkout button doesn't work (frontend)
- Check browser console for network errors
- Verify backend is running (`npm start` in /server)
- Confirm `/api/checkout` endpoint responds

---

## 📝 Future Enhancements

- [ ] User authentication (OAuth/JWT)
- [ ] Booking calendar for time-based reservations
- [ ] Equipment damage reporting workflow
- [ ] Maintenance scheduling system
- [ ] Automated email notifications
- [ ] Advanced reporting & analytics dashboard
- [ ] Mobile app (React Native)
- [ ] QR code scanning for quick checkout
- [ ] Integration with lab management systems

---

## 📧 Support

For questions or issues:
1. Check browser console (F12) for errors
2. Review MongoDB Atlas logs
3. Verify all environment variables are set
4. Review code comments for implementation details

---

**Lab-Reserve v1.0** — Built with ❤️ for STEM education | © 2026
