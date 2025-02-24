import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	fetchCustomerData,
	placeOrder,
} from "../../store/slices/customerSlice";
import { useDispatch } from "react-redux";

const PaymentSuccess = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const processOrder = async () => {
			await dispatch(placeOrder());
			await dispatch(fetchCustomerData());
		};
		processOrder();
	}, [dispatch]);

	const handleViewOrders = () => {
		navigate('/orders');
		window.location.reload();
	};

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
			<div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
				<div className="mb-6">
					<div className="h-24 w-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
						<svg
							className="h-12 w-12 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
					</div>
				</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-4">
					Payment Successful!
				</h2>
				<p className="text-gray-600 mb-8">
					Thank you for your purchase. Your order has been successfully
					processed and will be delivered soon.
				</p>
				<div className="space-y-4">
					<button
						onClick={handleViewOrders}
						className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-300"
					>
						View Orders
					</button>
					<Link
						to="/"
						className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-300"
					>
						Continue Shopping
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
