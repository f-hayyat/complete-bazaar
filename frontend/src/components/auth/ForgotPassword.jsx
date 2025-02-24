import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessages from "../common/ErrorMessages";

const ForgotPassword = () => {
	const [errorMessages, setErrorMessages] = useState([]);
	const emailRef = useRef();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessages([]);

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: emailRef.current.value,
					}),
				}
			);

			const data = await res.json();
			if (res.status === 200) {
				navigate(`/reset-password?email=${emailRef.current.value}`);
			} else {
				setErrorMessages(data.errorMessages);
			}
		} catch (err) {
			setErrorMessages(["Something went wrong. Please try again."]);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Forgot Password</h1>
			<ErrorMessages errorMessages={errorMessages} />

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						ref={emailRef}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
						required
					/>
				</div>
				<div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Email Reset OTP
					</button>
				</div>
			</form>
		</div>
	);
};

export default ForgotPassword;
