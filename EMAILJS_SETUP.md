# EmailJS Setup Guide

This guide will help you connect the contact form to send emails to **benazirpackgroup@gmail.com**.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service

1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (or your email provider)
4. Connect your Gmail account (benazirpackgroup@gmail.com)
5. Copy the **Service ID** (you'll need this later)

## Step 3: Create Email Template

1. In EmailJS Dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Use these settings:

   **Template Name:** Contact Form Submission
   
   **Subject:** New Contact Form Submission from Benazir Group Website
   
   **Content:**
   ```
   New message from: {{from_name}}
   Email: {{from_email}}
   
   Message:
   {{message}}
   
   ---
   Reply to: {{reply_to}}
   ```

4. Click **Save**
5. Copy the **Template ID** (you'll need this later)

## Step 4: Get Public Key

1. In EmailJS Dashboard, go to **Account** → **General**
2. Find **API Keys** section
3. Copy your **Public Key** (you'll need this later)

## Step 5: Update the Code

Open the file `js/script.js` and find these lines (around line 120):

```javascript
const serviceID = "YOUR_SERVICE_ID";
const templateID = "YOUR_TEMPLATE_ID";
const publicKey = "YOUR_PUBLIC_KEY";
```

Replace them with your actual values:

```javascript
const serviceID = "service_xxxxxxxxx"; // Your Service ID from Step 2
const templateID = "template_xxxxxxxxx"; // Your Template ID from Step 3
const publicKey = "xxxxxxxxxxxxxxxx"; // Your Public Key from Step 4
```

## Step 6: Test the Form

1. Open `contact.html` in your browser
2. Fill out the form with test data
3. Submit the form
4. Check benazirpackgroup@gmail.com inbox for the email

## Troubleshooting

- **"EmailJS not loaded" error**: Make sure the EmailJS script is loading. Check browser console for errors.
- **"Invalid service ID"**: Double-check your Service ID in EmailJS Dashboard
- **"Invalid template ID"**: Double-check your Template ID in EmailJS Dashboard
- **Emails not arriving**: Check spam folder, verify email service is connected correctly

## Free Plan Limits

EmailJS free plan includes:
- 200 emails per month
- Basic email templates
- Gmail, Outlook, and other email providers

If you need more emails, consider upgrading to a paid plan.

## Security Note

The Public Key is safe to use in frontend code. It's designed to be public. However, make sure your email service is properly configured and you've set up rate limiting if needed.
