# 📧 EmailJS Setup Guide - Contact Form को Gmail के साथ जोड़ें

यह guide आपको बताएगी कि कैसे आपके website के contact form को directly आपके Gmail (`sujantechdev@gmail.com`) के साथ connect करें।

## 🚀 Step 1: EmailJS Account बनाएं

1. **EmailJS Website पर जाएं**: https://www.emailjs.com/
2. **Sign Up करें** - Free account बनाएं
3. **Gmail के साथ Sign up करें** (sujantechdev@gmail.com use करें)

## ⚙️ Step 2: Email Service Add करें

1. Dashboard में जाकर **"Email Services"** पर click करें
2. **"Add New Service"** पर click करें
3. **"Gmail"** को select करें
4. **"Connect Account"** पर click करें
5. आपका Gmail account (sujantechdev@gmail.com) connect करें
6. Service ID note करें (जैसे: `service_xyz123`)

## 📝 Step 3: Email Template बनाएं

1. **"Email Templates"** पर जाएं
2. **"Create New Template"** पर click करें
3. **Template में यह content डालें**:

```
Subject: Portfolio Contact Form Submission

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from your portfolio website contact form.
```

4. Template को save करें
5. Template ID note करें (जैसे: `template_abc456`)

## 🔑 Step 4: Public Key निकालें

1. **"Account"** > **"General"** में जाएं
2. **Public Key** को copy करें (जैसे: `user_def789`)

## 🔧 Step 5: Website में Configuration Update करें

अब आपको `script.js` file में यह values update करनी हैं:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'user_def789',        // आपकी Public Key
    serviceId: 'service_xyz123',     // आपकी Service ID
    templateId: 'template_abc456'    // आपकी Template ID
};
```

### Configuration Update करने के लिए:

1. `C:\Users\sujan\Desktop\devloper website\script.js` file को open करें
2. Line 176-178 में अपनी actual values डालें:

```javascript
const EMAILJS_CONFIG = {
    publicKey: 'आपकी_PUBLIC_KEY_यहां_डालें',
    serviceId: 'आपकी_SERVICE_ID_यहां_डालें', 
    templateId: 'आपकी_TEMPLATE_ID_यहां_डालें'
};
```

## ✅ Step 6: Test करें

1. Website को browser में open करें
2. Contact form fill करें
3. "Send Message" पर click करें
4. आपके Gmail पर message आना चाहिए!

## 🎯 Template Variables

EmailJS template में ये variables available हैं:
- `{{from_name}}` - Visitor का name
- `{{from_email}}` - Visitor की email
- `{{message}}` - Message content
- `{{to_email}}` - आपकी email (sujantechdev@gmail.com)
- `{{subject}}` - Email subject

## 🚨 Important Notes

1. **Free Plan Limits**: EmailJS के free plan में 200 emails/month limit है
2. **Backup Option**: अगर EmailJS fail हो जाए तो automatically mailto link open होगा
3. **Testing**: पहले test email भेजकर check करें कि सब कुछ working है

## 🔒 Security

- Public Key safe है - यह client-side में use होती है
- Private keys कभी भी frontend code में न डालें
- EmailJS automatically spam protection provide करता है

## 🛠️ Troubleshooting

### अगर emails नहीं आ रहे:
1. Gmail के spam folder check करें
2. EmailJS dashboard में logs check करें
3. Browser console में errors check करें
4. सभी IDs correctly copy की हैं या नहीं verify करें

### अगर form submit नहीं हो रहा:
1. Internet connection check करें
2. Browser में JavaScript enabled है या नहीं check करें
3. Console में error messages देखें

## 📞 Need Help?

अगर कोई problem आए तो:
1. EmailJS documentation देखें: https://www.emailjs.com/docs/
2. या मुझसे contact करें for technical support

---

**🎉 Setup Complete होने के बाद आपका contact form directly आपके Gmail पर messages send करेगा!**