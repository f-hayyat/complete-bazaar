//This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_Secret_Key);

exports.checkoutPayment = async (req, res) => {
	const { amount } = req.body;
	const YOUR_DOMAIN = process.env.FRONTEND_URL;

	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: [
				{
					price_data: {
						currency: "pkr",
						product_data: {
							name: "Complete Bazaar Order",
						},
						unit_amount: amount,
					},
					quantity: 1,
				},
			],
			mode: "payment",
			success_url: `${YOUR_DOMAIN}/payment-success`,
			cancel_url: `${YOUR_DOMAIN}/payment-failed`,
		});

		res.json({ sessionId: session.id });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
