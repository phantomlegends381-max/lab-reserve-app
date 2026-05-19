# Lab-Reserve Quick Reference

## 🚀 Common Commands

### Development
```bash
# Install dependencies (with Tailwind)
cd client && npm install --legacy-peer-deps
cd server && npm install

# Run frontend dev server (Vite) - http://localhost:5173
cd client && npm run dev

# Run backend API server - http://localhost:5000
cd server && npm start

# Build frontend for production
cd client && npm run build

# Preview production build locally
cd client && npm run preview
```

### Deployment
```bash
# Push changes to GitHub
git add .
git commit -m "Your message"
git push

# Manually redeploy on Vercel (if needed)
# Go to Vercel Dashboard → Deployments → Redeploy Latest
```

---

## 📊 Inventory Items Reference

### Quick Stats
- **Total Items**: 18 hardware products
- **Total Units**: 260+ (combined availability)
- **Categories**: 6 (Microcontroller, Sensor, Prototyping, Power, Connectivity, Other)

### IDs by Category

**Microcontrollers:**
- `mcu-001` — ESP32 DevKit V1 (30-pin, 3.3V) — 18/25 available
- `mcu-002` — Arduino Uno R3 (14-pin, 5V) — 12/20 available
- `mcu-003` — Raspberry Pi Pico (26-pin, 3.3V) — 8/15 available

**Sensors:**
- `sen-001` — HC-SR04 Ultrasonic (5V) — 28/30 available
- `sen-002` — DHT11 Temp/Humidity (3.3V-5V) — 16/22 available
- `sen-003` — MPU6050 Gyroscope (3.3V) — 14/18 available
- `sen-004` — BMP280 Barometer (3.3V) — 10/12 available

**Prototyping:**
- `proto-001` — Breadboard 400-point — 42/50 available
- `proto-002` — Jumper Wires 65-piece — 38/40 available
- `proto-003` — SG90 Servo 5V — 11/16 available
- `proto-004` — Resistor Assortment 500-piece — 19/20 available
- `proto-005` — LED Assortment 100-piece — 13/15 available
- `proto-006` — Capacitor Assortment 200-piece — 9/10 available

**Power:**
- `pwr-001` — USB-C Power Supply 0-30V, 3A — 4/5 available

**Connectivity:**
- `conn-001` — USB Type-C Cable 1m — 22/25 available
- `conn-002` — FTDI Serial USB Adapter 5V — 6/8 available

---

## 🔧 API Endpoints

### Checkout Endpoint
**POST** `/api/checkout`

**Example Request:**
```json
{
  "itemId": "mcu-001",
  "studentId": "STU-2024-001",
  "quantity": 1
}
```

**Success Response (200):**
```json
{
  "message": "Checkout completed successfully.",
  "code": "CHECKOUT_SUCCESS",
  "item": {
    "id": "mcu-001",
    "name": "ESP32 DevKit V1",
    "category": "Microcontroller"
  },
  "checkoutDetails": {
    "quantity": 1,
    "studentId": "STU-2024-001",
    "timestamp": "2026-05-19T10:30:45.123Z"
  },
  "updatedInventory": {
    "available": 17,
    "total": 25
  },
  "compatibilityWarning": null
}
```

**Error Responses:**
- `400 MISSING_FIELDS` — Missing itemId, studentId, or quantity
- `400 INVALID_QUANTITY` — Quantity not a positive integer
- `404 ITEM_NOT_FOUND` — Item doesn't exist in database
- `409 INSUFFICIENT_STOCK` — Requested qty > available qty
- `500 SERVER_ERROR` — Database error

### Status Endpoint (Optional)
**GET** `/api/checkout/status/:itemId`

Returns current availability of an item.

---

## 🎨 Component Tree

```
App.jsx
├── Header (Navigation)
├── SearchBar.jsx
├── FilterBar.jsx
├── Main Content Grid
│   └── EquipmentCard.jsx (x18)
│       └── StatusBadge.jsx
├── CheckoutModal.jsx
│   ├── StatusBadge.jsx
│   ├── Specification Panel
│   └── Safety Warning (if 3.3V)
└── Footer
```

---

## 🎓 Key Code Sections for Portfolio Review

### Frontend
- **App.jsx**: Search + filter logic using useMemo
- **CheckoutModal.jsx**: Form handling, API integration, async validation
- **StatusBadge.jsx**: Conditional rendering based on inventory %
- **Tailwind Config**: Custom STEM color palette

### Backend
- **server/routes/checkout.js**: Atomic DB operations, comprehensive validation
- **server/index.js**: Express setup, CORS, route mounting
- **vercel.json**: Deployment routing configuration

---

## 🌍 Environment Variables

### Frontend (.env not needed - all client-side)
N/A — Frontend uses API at `/api/checkout`

### Backend (.env file required)
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/lab-reserve
PORT=5000  # Optional, default: 5000
```

### Vercel Environment Variables
```
MONGODB_URI: <your-mongodb-atlas-string>
```

---

## 📋 File Structure Summary

```
lab-reserve-app/
├── client/
│   ├── src/
│   │   ├── components/          (4 new components)
│   │   ├── data/
│   │   │   └── inventory.js     (18 items, 260+ units)
│   │   ├── App.jsx              (redesigned)
│   │   └── index.css            (Tailwind imports)
│   ├── tailwind.config.js        (NEW)
│   ├── postcss.config.js         (NEW)
│   └── package.json             (Tailwind deps added)
├── server/
│   ├── routes/
│   │   └── checkout.js          (improved validation)
│   └── index.js                 (Express setup)
├── vercel.json                  (updated routing)
├── IMPLEMENTATION_GUIDE.md      (NEW - comprehensive docs)
└── QUICK_REFERENCE.md           (THIS FILE)
```

---

## 🚨 Common Issues & Fixes

**Issue**: Tailwind styles not showing in dev
**Fix**: 
```bash
# Restart dev server
npm run dev
# Clear browser cache (Ctrl+Shift+Delete)
```

**Issue**: CheckoutModal doesn't appear
**Fix**: Check browser console for React errors, ensure EquipmentCard calls `onCheckout(item)`

**Issue**: API returns 409 (INSUFFICIENT_STOCK)
**Fix**: Requested quantity > currentAvailable. Check inventory.js quantities.

**Issue**: MongoDB connection error
**Fix**: Verify MONGODB_URI env var, check network access in Atlas

---

## 💡 Testing Checklist

- [ ] Frontend builds without errors: `npm run build --prefix client`
- [ ] Dev server starts: `npm run dev` (client) + `npm start` (server)
- [ ] Search filters work correctly
- [ ] Checkout modal opens on card click
- [ ] Form validation prevents empty submissions
- [ ] Quantity selector works (+ and - buttons)
- [ ] API responds with success/error messages
- [ ] Inventory decrements after checkout
- [ ] 3.3V sensors show voltage warning
- [ ] Responsive design works (mobile/tablet/desktop)

---

**Last Updated**: May 19, 2026  
**Version**: 1.0 — Production Ready
