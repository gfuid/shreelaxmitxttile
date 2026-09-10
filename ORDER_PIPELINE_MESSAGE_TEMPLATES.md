# 🌸 Sri Vijay Laxmi Sarees & Textiles — CRM Pipeline Message Templates

Yeh file aapke CRM (FlowConnect / WABA / Resend / Interakt / WATI) ke sabhi **8 Pipeline Stages** ke liye WhatsApp aur Email templates provide karti hai.

---

## 📌 Variable Legend (Placeholders)
Aapke CRM me message bhejte waqt yeh variables dynamically fill honge:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `{{customer_name}}` | Customer ka pura ya first name | Radhika Sharma |
| `{{order_id}}` | Order number | SVL-1082 |
| `{{total_amount}}` | Order ka total bill amount | 4,850 |
| `{{payment_method}}` | Payment type | COD / Prepaid UPI |
| `{{item_names}}` | Ordered sarees / items | Pure Gadwal Pattu Silk Saree (Crimson Red) |
| `{{shipping_address}}` | Delivery address | Flat 402, Banjara Hills, Hyderabad |
| `{{courier_name}}` | Courier partner ka naam | BlueDart / Delhivery / DTDC |
| `{{tracking_number}}` | Courier AWB / Tracking number | BLD892748192 |
| `{{tracking_url}}` | Live tracking link | `https://srivijaylaxmisarees.com/track-order` |
| `{{review_url}}` | Google Review / Website Feedback link | `https://srivijaylaxmisarees.com/reviews` |
| `{{cancellation_reason}}` | Order cancel karne ka reason | Customer request / Pin code unserviceable |
| `{{delivery_date}}` | Delivery hone ki date | 10 Oct 2026 |

---

## 1. Stage: Order Confirm
> **Trigger:** Jab website ya phone se order verify aur confirm hota hai.

### 🟢 WhatsApp Template
```text
🌸 नमस्ते {{customer_name}},

Sri Vijay Laxmi Textiles se aapka order confirm ho gaya hai! 🎉

📦 Order ID: #{{order_id}}
💰 Total Amount: ₹{{total_amount}} ({{payment_method}})
🛍️ Items: {{item_names}}

Aapka parcel safe packing aur dispatch team ko bhej diya gaya hai. Agla update jaldi hi share karenge.

🔗 Live Status Dekhein: {{tracking_url}}

Kissi bhi sahayata ke liye is number par WhatsApp karein.
— Team Sri Vijay Laxmi Textiles, Hyderabad
```

### 📧 Email Template
* **Subject:** `🌸 Order Confirmed: Sri Vijay Laxmi Textiles (Order #{{order_id}})`
```text
Namaste {{customer_name}},

Sri Vijay Laxmi Textiles (India) P Ltd ko chunne ke liye dhanyawad!

Aapka order successfully confirm ho gaya hai:
--------------------------------------------------
Order ID: #{{order_id}}
Total Amount: ₹{{total_amount}}
Payment Mode: {{payment_method}}
Shipping Address: {{shipping_address}}
--------------------------------------------------

Aapki authentic handloom saree Silk Mark certificate aur velvet protection pouch ke saath pack ki ja rahi hai.

Aap apne order ka status yahan track kar sakte hain:
{{tracking_url}}

With Warm Regards,
Sri Vijay Laxmi Textiles (India) P Ltd
God Gift Market, Rikab Gunj, Hyderabad
Contact: +91 93945 12326
```

---

## 2. Stage: In Packing / Processing
> **Trigger:** Jab warehouse me fabric quality check, Silk Mark verification aur packaging shuru hoti hai.

### 🟢 WhatsApp Template
```text
🧵 नमस्ते {{customer_name}},

Update: Aapka order #{{order_id}} packing phase me hai! 📦

Hamare quality team dwara saree ka weave, zari work aur Silk Mark tag verify karke secure box me pack kiya ja raha hai taaki transit me saree 100% surakshit rahe.

Jaldi hi dispatch karke courier tracking number share karenge.

— Sri Vijay Laxmi Textiles, Hyderabad
```

### 📧 Email Template
* **Subject:** `🧵 We are packing your order #{{order_id}} - Quality Inspection in progress`
```text
Dear {{customer_name}},

Aapka order #{{order_id}} hamari warehouse team ke dwara pack kiya ja raha hai.

Har saree dispatch se pehle strict quality checks se gujarti hai:
✔ Fabric & Zari inspection
✔ Silk Mark authentication certification
✔ Velvet preservation sleeve & tamper-evident packaging

Agla step courier handover ka hoga. Hum courier AWB generate hote hi aapko tracking details mail karenge.

Order Track karein: {{tracking_url}}

Warm Regards,
Team Sri Vijay Laxmi Textiles
```

---

## 3. Stage: Dispatched
> **Trigger:** Jab courier team (BlueDart/Delhivery/DTDC) parcel pickup karti hai aur AWB generate hota hai.

### 🟢 WhatsApp Template
```text
🚚 नमस्ते {{customer_name}},

Khushkhabri! Aapka saree parcel Hyderabad showroom se DISPATCH ho chuka hai. 🚀

📦 Order ID: #{{order_id}}
🚛 Courier Partner: {{courier_name}}
🔢 AWB Tracking No: {{tracking_number}}

🔗 Parcel Track Karein: {{tracking_url}}

Aapka parcel 3-5 working days me aapke pate par deliver hone ki sambhavna hai.

— Sri Vijay Laxmi Textiles
```

### 📧 Email Template
* **Subject:** `🚚 Your saree parcel is dispatched! (AWB #{{tracking_number}})`
```text
Hello {{customer_name}},

Aapka parcel dispatch ho chuka hai aur transit me hai!

Dispatch Details:
--------------------------------------------------
Order ID: #{{order_id}}
Courier: {{courier_name}}
Tracking / AWB Number: {{tracking_number}}
Live Tracking Link: {{tracking_url}}
--------------------------------------------------

Parcel courier partner ke paas live scan ho chuka hai. Delivery agent ke aane par OTP/call aayega.

Agar koi delivery query ho toh hamare customer support (+91 93945 12326) par call ya WhatsApp karein.

Best Regards,
Sri Vijay Laxmi Textiles
```

---

## 4. Stage: In Transit
> **Trigger:** Jab parcel state/city ke delivery hub ki taraf forward hota hai.

### 🟢 WhatsApp Template
```text
📍 नमस्ते {{customer_name}},

Aapka order #{{order_id}} aapke city ki taraf safar me hai (In Transit).

🚛 Current Courier: {{courier_name}}
🔢 Tracking: {{tracking_number}}

Jaise hi parcel aapke local delivery hub par pahuchega, hum aapko notify karenge.

Live Location: {{tracking_url}}

— Sri Vijay Laxmi Textiles
```

### 📧 Email Template
* **Subject:** `📍 Transit Update: Your order #{{order_id}} is on its way`
```text
Dear {{customer_name}},

Yeh aapke order #{{order_id}} ka live status update hai.

Aapka parcel courier network me successfully move ho raha hai aur aapke nearest delivery hub ki taraf forward ho chuka hai.

Courier: {{courier_name}}
AWB Number: {{tracking_number}}
Direct Tracking: {{tracking_url}}

Expected Delivery: Agle 1-2 dino me.

Dhanyawad,
Sri Vijay Laxmi Textiles
```

---

## 5. Stage: Out for Delivery
> **Trigger:** Jab courier rider delivery route par nikalta hai.

### 🟢 WhatsApp Template
```text
🛵 नमस्ते {{customer_name}},

Aapka saree parcel aaj deliver hone wala hai! 🎉

📦 Order ID: #{{order_id}}
🛵 Courier Partner: {{courier_name}}
💵 Collectible Amount: ₹{{total_amount}} ({{payment_method}})

Kripya apna mobile number active rakhein taaki delivery partner aapse contact kar sake.

Koi problem ho toh humein batayein: +91 93945 12326

— Sri Vijay Laxmi Textiles
```

### 📧 Email Template
* **Subject:** `🛵 Out for Delivery Today: Order #{{order_id}}`
```text
Hello {{customer_name}},

Aapka Sri Vijay Laxmi order #{{order_id}} aaj delivery ke liye nikal chuka hai!

Delivery Information:
Courier: {{courier_name}}
Estimated Delivery: Aaj Sham tak
Amount to Pay: ₹{{total_amount}} ({{payment_method}})

Kripya delivery executive ka call attend karein. Parcel open karne se pehle package seal check kar lein.

Regards,
Sri Vijay Laxmi Textiles
```

---

## 6. Stage: Delivered
> **Trigger:** Jab customer ko parcel safely mil jata hai.

### 🟢 WhatsApp Template
```text
🎉 नमस्ते {{customer_name}},

Aapka order #{{order_id}} successfully DELIVER ho gaya hai! ✨

Hum umeed karte hain ki aapko Sri Vijay Laxmi ki authentic handloom saree aur zari pasand aayi hogi.

🛍️ Silk Care Tip: Pure silk sarees ko dry-clean hi karwayein aur cold dry jagah par velvet sleeve me preserve karein.

Sri Vijay Laxmi Textiles par vishwas karne ke liye hardik dhanyawad! 🙏
```

### 📧 Email Template
* **Subject:** `🎉 Delivered: Sri Vijay Laxmi Textiles Order #{{order_id}}`
```text
Dear {{customer_name}},

Aapka parcel successfully deliver ho chuka hai!

Order Summary:
Order ID: #{{order_id}}
Delivered On: {{delivery_date}}

Sri Vijay Laxmi family ka hissa banne ke liye dhanyawad. Hamari sarees generation-to-generation heirloom quality ke saath banti hain.

Pure Silk Care Guide:
1. Always Dry Clean for initial washes.
2. Store in the complimentary breathable cotton/velvet bag provided.
3. Keep away from direct damp areas.

Shubhkaamnayein,
Sri Vijay Laxmi Textiles (India) P Ltd
Rikab Gunj, Hyderabad
```

---

## 7. Stage: Thank You (Review & Repeat Gift Offer)
> **Trigger:** Delivery ke 24 se 48 ghante baad automated feedback aur agle order ke liye discount coupon bhejte waqt.

### 🟢 WhatsApp Template
```text
💖 नमस्ते {{customer_name}},

Aapka anubhav kaisa raha? 🌸

Sri Vijay Laxmi sarees par aapka feedback hamare weavers aur artisans ke liye bahut anmol hai.

⭐ Agar aapko saree pasand aayi, toh kripya 1 minute nikaalkar photo ke saath review share karein:
👉 Review Link: {{review_url}}

🎁 Agle Order ke liye Special Gift Voucher:
Coupon Code: *ROYAL10* (Flat 10% Off)
Aap is coupon ko hamari website par kisi bhi naye catalogue par use kar sakte hain!

Aapka din shubh ho! 🙏
```

### 📧 Email Template
* **Subject:** `💖 A heartfelt Thank You + Special 10% Gift for you, {{customer_name}}`
```text
Namaste {{customer_name}},

Sri Vijay Laxmi Textiles par vishwas dikhane ke liye shukriya. 

Aapka feedback hamare weavers ke liye bahut mehatvapurna hai. Kya aapko fabric, drape aur zari pasand aayi?

Apna anubhav share karein:
[ Leave a Quick Review ] ➜ {{review_url}}

As a token of our appreciation, yahan aapke agle festive ya wedding shopping ke liye ek special voucher hai:
Coupon Code: ROYAL10
Discount: Flat 10% OFF on Next Order
Website: https://srivijaylaxmisarees.com/shop

Aapke agle order par dobara seva karne ka mauka zaroor dein!

Warmest Regards,
Sri Vijay Laxmi Family, Hyderabad
```

---

## 8. Stage: Cancelled
> **Trigger:** Agar customer ya admin dwara order cancel kiya jata hai.

### 🟢 WhatsApp Template
```text
⚠️ नमस्ते {{customer_name}},

Aapka order #{{order_id}} cancel kar diya gaya hai.

Reason: {{cancellation_reason}}

Refund Status (Agar online pay kiya tha):
Refund 3-5 business days me aapke original payment source me credit ho jayega.

Agar yeh kisi galti se cancel hua hai ya aap dobara order karna chahte hain, toh kripya humein WhatsApp karein: +91 93945 12326

— Sri Vijay Laxmi Textiles
```

### 📧 Email Template
* **Subject:** `Order Cancellation Notice: #{{order_id}}`
```text
Dear {{customer_name}},

Yeh confirm karne ke liye hai ki aapka order #{{order_id}} cancel kar diya gaya hai.

Cancellation Reason: {{cancellation_reason}}

Refund Status:
Agar aapne online UPI/Card/Netbanking se pay kiya tha, toh refund 3-5 business days ke andar aapke bank account me credit ho jayega.

Agar aap naya order place karna chahte hain ya koi query hai, toh hamari support team se contact karein:
Phone / WhatsApp: +91 93945 12326
Email: srivijaylaxmitextiles@gmail.com

Regards,
Sri Vijay Laxmi Textiles
```
