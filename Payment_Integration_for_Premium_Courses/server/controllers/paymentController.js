const Stripe = require('stripe');
const Course = require('../models/Course');
const Order = require('../models/Order');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/stripe/create-session — logged-in student only.
// Creates a Stripe Checkout Session for a single premium course and
// records a matching 'pending' Order so the webhook has something to update.
async function createCheckoutSession(req, res) {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    if (course.isFree) {
      return res.status(400).json({ success: false, message: 'This course is free — no payment needed' });
    }

    const alreadyOwns = req.user.purchasedCourses.some(
      (id) => id.toString() === course._id.toString()
    );
    if (alreadyOwns) {
      return res.status(400).json({ success: false, message: 'You already own this course' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: course.title },
            unit_amount: Math.round(course.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      // metadata is how the webhook knows which student unlocks which course —
      // this is the proven pattern from the prior project.
      metadata: {
        courseId: course._id.toString(),
        studentId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&courseId=${course._id.toString()}`,
cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    await Order.create({
      studentId: req.user._id,
      courseId: course._id,
      amountPaid: course.price,
      paymentId: session.id,
      status: 'pending',
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create checkout session' });
  }
}

module.exports = { createCheckoutSession };
