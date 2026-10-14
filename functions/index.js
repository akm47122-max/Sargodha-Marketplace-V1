const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const ADMIN_EMAILS = ['akm47122@gmail.com', 'admin@sargodhamart.com'];

/**
 * 1. Trusted Payment Approval Trigger
 * When an administrator approves an activation payment proof, securely mark
 * the user account as active and verified.
 */
exports.onPaymentUpdated = onDocumentUpdated('activation_payments/{paymentId}', async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  // Only trigger if status changed to 'approved'
  if (before.status !== 'approved' && after.status === 'approved') {
    const userId = after.userId;
    if (!userId) return null;

    const userRef = db.collection('users').doc(userId);
    await userRef.set(
      {
        activationStatus: 'active',
        isVerified: true,
        activatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Create a celebration notification for the user
    await db.collection('notifications').add({
      userId: userId,
      type: 'ACTIVATION',
      title: '🎉 Account Activated Successfully!',
      message: 'Your Rs. 1,000 lifetime seller activation has been verified. You can now post unlimited products directly!',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }
  return null;
});

/**
 * 2. Secure Telegram Broadcast Trigger
 * Broadcast new listings to the official Telegram channel securely without
 * exposing the TELEGRAM_BOT_TOKEN to client browsers.
 */
exports.onListingCreated = onDocumentCreated('listings/{listingId}', async (event) => {
  const listing = event.data.data();
  if (!listing) return null;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TELEGRAM_CHANNEL_ID || '@sargodhamart';

  if (!botToken) {
    console.log('TELEGRAM_BOT_TOKEN not configured; skipping Telegram broadcast.');
    return null;
  }

  const caption = `🛒 *New Listing in ${listing.city || 'Sargodha'}*\n\n*${listing.title}*\n💰 Price: Rs. ${Number(listing.price).toLocaleString()}\n📍 Area: ${listing.area || 'Local'}\n📱 Contact: ${listing.sellerPhone || 'Contact in App'}\n\n🌐 View on SargodhaMart`;

  try {
    const fetch = (await import('node-fetch')).default;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: channelId,
        text: caption,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Failed to dispatch Telegram broadcast:', err);
  }
  return null;
});

/**
 * 3. Callable Admin Verification
 */
exports.checkAdminStatus = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const email = request.auth.token.email?.toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(email);

  if (!isAdmin) {
    const adminDoc = await db.collection('admins').doc(request.auth.uid).get();
    return { isAdmin: adminDoc.exists };
  }

  return { isAdmin: true };
});
