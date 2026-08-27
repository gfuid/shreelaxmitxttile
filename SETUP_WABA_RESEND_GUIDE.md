# 🌸 Sri Vijaylaxmi Sarees — WhatsApp (WABA) & Resend Email Setup Guide

This guide explains how to get your **Meta WhatsApp Cloud API (WABA) Permanent Access Token** and **Resend Email API Key** to start sending live order notifications, PDF tax invoices, and bulk festive broadcasts.

---

## 📱 PART 1: Meta WhatsApp Business API (WABA)

Your WhatsApp account is already active and verified:
* **Sender Phone:** `+91 82183 22073`
* **Phone Number ID:** `1252418734612866`
* **Daily Tier:** `2,000 Messages / Day` (Auto-upgrades to 10K, then 100K)

### Step 1: Get Permanent Meta System User Token (Takes 2 Minutes)
By default, the temporary token in Meta Developer console expires in 24 hours. To generate a **Permanent (Never Expiring) Token**:

1. Go to [business.facebook.com/settings](https://business.facebook.com/settings) (Facebook Business Manager).
2. Under **Users**, click on **System Users** (सिस्टम यूजर्स).
3. Click **Add** ➜ Name it `SVL_Notification_Admin` ➜ Role: **Admin**.
4. Under **Assigned Assets**, assign your WhatsApp Account with **Full Control**.
5. Click **Generate New Token**:
   * Select App: Your WhatsApp App
   * Select Permissions (चेकबॉक्स टिक करें):
     * `whatsapp_business_messaging`
     * `whatsapp_business_management`
6. Click **Generate Token** and copy the long token string (`EAAG...`).
7. Paste this token in your **Admin Panel ➜ Marketing & CRM ➜ WABA & Resend Credentials** and click **Save**.

---

### Step 2: Register 7 Order Templates in Meta Business Manager
In Meta Business Manager ➜ **WhatsApp Manager ➜ Message Templates ➜ Create Template**:
* **Category:** Always select **UTILITY** (ऑटोमैटिकली 1 से 2 मिनट में अप्रूव हो जाता है)
* **Language:** Hindi (`hi`) or English (`en`)

#### 1. `svl_order_placed` (Order Confirmation)
> **Body Text:**  
> 🌸 नमस्ते **{{1}}**, Sri Vijaylaxmi Sarees से आपकी खरीदारी के लिए धन्यवाद! आपका ऑर्डर **#{{2}}** स्वीकार कर लिया गया है। कुल अमाउंट: ₹**{{3}}** (**{{4}}**)। आपका बिल/इनवॉइस तैयार है।  
> **Buttons:** Quick Reply / URL: `Track Order` ➜ `https://srivijaylaxmisarees.com/track/{{2}}`

#### 2. `svl_order_confirmed` (Order Confirmed)
> **Body Text:**  
> 🧵 नमस्ते **{{1}}**, आपका ऑर्डर **#{{2}}** स्वीकार कर लिया गया है और हमारी हैंडलूम टीम आपकी साड़ी तैयार कर रही है।

#### 3. `svl_order_packed` (Order Packed)
> **Body Text:**  
> 📦 नमस्ते **{{1}}**, आपका ऑर्डर **#{{2}}** स्वीकार कर लिया गया है और आपकी प्योर सिल्क साड़ी को सिल्क प्रोटेक्टिव बॉक्स में सुरक्षित पैक कर दिया गया है।

#### 4. `svl_order_shipped` (Shipped & In Transit)
> **Body Text:**  
> 🚚 नमस्ते **{{1}}**, आपका ऑर्डर **#{{2}}** रवाना हो चुका है! कूरियर: **{{3}}**, Tracking AWB: **{{4}}**। लाइव लोकेशन ट्रैक करें।  
> **Buttons:** URL: `Live Tracking` ➜ `https://srivijaylaxmisarees.com/track/{{2}}`

#### 5. `svl_out_for_delivery` (Out for Delivery)
> **Body Text:**  
> 🛵 नमस्ते **{{1}}**, आपका साड़ी पार्सल (**#{{2}}**) आज आपके पते पर डिलीवर होने वाला है। कृपया फोन एक्टिव रखें।

#### 6. `svl_order_delivered` (Order Delivered)
> **Body Text:**  
> 🎉 नमस्ते **{{1}}**, आपका ऑर्डर **#{{2}}** सफलतापूर्वक डिलीवर हो गया है! Sri Vijaylaxmi Sarees को चुनने के लिए धन्यवाद। आशा है आपको साड़ी पसंद आई होगी।

#### 7. `svl_order_cancelled` (Order Cancelled)
> **Body Text:**  
> ❌ नमस्ते **{{1}}**, आपका ऑर्डर **#{{2}}** कैंसिल कर दिया गया है। कारण: **{{3}}**। रिफंड या सहायता के लिए WhatsApp करें।

---

## 📧 PART 2: Resend Email Engine Setup (3,000 Free Emails / Month)

### Step 1: Get Resend API Key (Takes 1 Minute)
1. Go to [resend.com/signup](https://resend.com/signup) and create a free account.
2. Go to [resend.com/api-keys](https://resend.com/api-keys) and click **Create API Key**.
3. Copy the key (starts with `re_...`).
4. Paste it in **Admin Panel ➜ Marketing & CRM ➜ WABA & Resend Credentials** and click **Save**.

### Step 2: Testing & Domain Setup
* **Immediate Dev Testing:** By default, you can send emails using `onboarding@resend.dev` to your registered email address.
* **Production Custom Domain:**
  1. In Resend dashboard ➜ **Domains** ➜ **Add Domain** (`srivijaylaxmisarees.com`).
  2. Add the 3 DNS records (DKIM, SPF) in your domain registrar (GoDaddy/Hostinger/Cloudflare).
  3. Status will turn green **Verified** within 5 minutes.
  4. Now all emails will be sent from `orders@srivijaylaxmisarees.com` directly to customers' inboxes.

---

## ⚡ PART 3: How to Test from Admin Panel

1. Open Admin Panel at `http://localhost:5174` (or your admin URL).
2. Go to the new **Marketing & CRM** section in the sidebar.
3. Click on the **"Send Test Ping"** button.
4. Enter your mobile number (e.g. `8218322073`) and your email address.
5. Select any order stage (e.g. `Placed` or `Shipped`) and click **Fire Test Message**.
6. Check your WhatsApp & Email inbox with attached PDF invoice!

---

## 📦 PART 4: Automatic Order Triggers
* When a customer places an order on the storefront ➜ **Placed** notification + PDF invoice auto-fires.
* In Admin Orders / Dashboard, when you change status to **Shipped** (entering BlueDart & AWB #) ➜ **Shipped** notification auto-fires with courier tracking.
* When marked **Delivered** ➜ **Delivered** notification with Silk Care tips auto-fires.
* Under **Bulk Offers & Broadcast**, you can send instant festival promo messages to all registered customers with 1 click.
