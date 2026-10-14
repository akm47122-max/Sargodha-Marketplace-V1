<?php
/**
 * SARGODHAMART - Hostinger Production Configuration Example
 * 
 * INSTRUCTIONS FOR HOSTINGER DEPLOYMENT:
 * 1. Log in to your Hostinger hPanel (https://hpanel.hostinger.com).
 * 2. Go to "Databases" -> "MySQL Databases" and note down:
 *    - Database Name (e.g. u123456789_sargodhamart)
 *    - Username      (e.g. u123456789_user)
 *    - Password      (the password you set when creating the database)
 *    - Host          (usually 'localhost' or '127.0.0.1' on Hostinger)
 * 3. Copy this file to "config/config.local.php" or update "config/config.php" with your details.
 * 4. Never commit real credentials to public git repositories.
 */

// Production Environment Settings
define('APP_ENV', 'production'); // 'production' or 'development'
define('APP_DEBUG', false);      // Set to false on live Hostinger site

// Hostinger MySQL Credentials - REPLACE WITH YOUR HOSTINGER DETAILS
define('DB_HOST', 'localhost');          // Hostinger MySQL Host (usually 'localhost')
define('DB_PORT', '3306');               // Default MySQL port
define('DB_NAME', 'YOUR_HOSTINGER_DB_NAME'); // e.g. 'u123456789_sargodhamart'
define('DB_USER', 'YOUR_HOSTINGER_DB_USER'); // e.g. 'u123456789_admin'
define('DB_PASS', 'YOUR_HOSTINGER_DB_PASSWORD'); // Your secure database password
define('DB_CHARSET', 'utf8mb4');

// Site Branding & URLs
define('SITE_NAME', 'SARGODHAMART');
define('SITE_TAGLINE', 'Buy • Sell • Jobs • Grow');
define('SITE_URL', 'https://sargodhamart.shop');

// Official Payment Details for Seller Activation (Rs. 1,000 one-time)
define('ONE_TIME_ACTIVATION_FEE', 1000);
define('OFFICIAL_PAYMENT_NUMBER', '03127453108');
define('OFFICIAL_ACCOUNT_NAME', 'Muhammad Akram Tayyab');
define('OFFICIAL_WHATSAPP_CHANNEL_URL', 'https://whatsapp.com/channel/0029Vb8bmhAGk1Fzze6iTX0g');
define('SUPPORT_PHONE', '03127453108');
define('SUPPORT_WHATSAPP', '923127453108');
define('SUPPORT_EMAIL', 'admin@sargodhamart.shop');
