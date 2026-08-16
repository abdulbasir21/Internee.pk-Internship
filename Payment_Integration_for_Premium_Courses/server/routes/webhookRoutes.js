const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/Order');
const User = require('../models/User');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/webhooks/stripe
// IMPORTANT: this route must receive the RAW request body (express.raw),
// not JSON-parsed, or Stripe's signature check will fail. That's why it's
// mounted in index.js before the global express.json() middleware.
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;

  try {
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Always respond 200 quickly after this point, even if our own processing
  // fails — we don't want Stripe retrying forever over an internal bug.
  // Failures are logged instead so an admin can reconcile manually.
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { courseId, studentId } = session.metadata || {};

      if (courseId && studentId) {
        await Order.findOneAndUpdate(
          { paymentId: session.id },
          { status: 'paid' }
        );

        await User.findByIdAndUpdate(studentId, {
          $addToSet: { purchasedCourses: courseId }, // addToSet avoids duplicate entries
        });
      } else {
        console.error('checkout.session.completed missing metadata', session.id);
      }
    }
  } catch (err) {
    console.error('Error processing Stripe webhook event:', err.message);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
