# API Testing Guide (Insomnia/Postman)

Base URL: `http://localhost:5000`

## 1. Authentication (Get Token First!)

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@demo.com",
  "password": "123456"
}
```
**Response**: Copy the `token` from response - you'll need it for authenticated requests!

### Other Demo Accounts
- Admin: `admin@demo.com` / `123456`
- Vendor: `tech@vendor.com` / `123456`

---

## 2. Products (No Auth Required)

### Get All Products
```
GET /api/products
```

### Get Single Product
```
GET /api/products/{productId}
```
Replace `{productId}` with an ID from the products list.

### Get Categories
```
GET /api/products/categories
```

---

## 3. Vendors

### Get All Vendors (Admin Only)
```
GET /api/vendor/all
Authorization: Bearer {your_token}
```

### Get Vendor Profile (Vendor Only)
```
GET /api/vendor/me
Authorization: Bearer {your_token}
```
Login as `tech@vendor.com` first!

### Vendor Dashboard
```
GET /api/vendor/dashboard
Authorization: Bearer {your_token}
```

---

## 4. Reviews

### Get Product Reviews
```
GET /api/reviews/{productId}
```

### Add/Update Review (Requires Auth)
```
POST /api/reviews/{productId}
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Great product!"
}
```

---

## 5. Coupons

### Get Active Coupons
```
GET /api/coupons
```

### Apply Coupon (Requires Auth)
```
POST /api/coupons/apply/WELCOME10
Authorization: Bearer {your_token}
```

---

## 6. Wishlist (Requires Auth)

### Get Wishlist
```
GET /api/wishlist
Authorization: Bearer {your_token}
```

### Add to Wishlist
```
POST /api/wishlist/add
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "productId": "{productId}"
}
```

### Remove from Wishlist
```
POST /api/wishlist/remove
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "productId": "{productId}"
}
```

---

## 7. Orders (Requires Auth)

### Get My Orders
```
GET /api/orders/my
Authorization: Bearer {your_token}
```

### Get Single Order
```
GET /api/orders/{orderId}
Authorization: Bearer {your_token}
```

---

## Quick Start Steps

1. **Login** to get token:
   ```
   POST /api/auth/login
   Body: { "email": "john@demo.com", "password": "123456" }
   ```

2. **Copy the token** from response

3. **Test any endpoint** by adding header:
   ```
   Authorization: Bearer {paste_token_here}
   ```

## Insomnia Tips

- Create an **Environment Variable** called `token` 
- After login, set: `token = response.token`
- Use in headers: `Bearer {{ _.token }}`
- Create a **Base Environment** with `base_url = http://localhost:5000`
- Use: `{{ _.base_url }}/api/products`
