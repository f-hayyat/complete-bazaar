import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ErrorMessages from "../common/ErrorMessages";

const ResetPassword = () => {
	const [errorMessages, setErrorMessages] = useState([]);
	const [searchParams] = useSearchParams();
	const otpRef = useRef();
	const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessages([]);

		if (passwordRef.current.value !== confirmPasswordRef.current.value) {
			setErrorMessages(["Passwords do not match"]);
			return;
		}

		try {
			const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: searchParams.get("email"),
					otp: otpRef.current.value,
					password: passwordRef.current.value,
				}),
			});

			const data = await res.json();
			if (res.status === 200) {
				navigate("/login");
			} else {
				setErrorMessages(data.errorMessages);
			}
		} catch (err) {
			setErrorMessages(["Something went wrong. Please try again."]);
		}
	};

	return (
		<div className="max-w-md mx-auto p-6">
			<h1 className="text-3xl font-bold text-gray-900 mb-8">Reset Password</h1>
			<ErrorMessages errorMessages={errorMessages} />

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="otp"
						className="block text-sm font-medium text-gray-700"
					>
						OTP
					</label>
					<input
						type="text"
						id="otp"
						ref={otpRef}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
						required
					/>
				</div>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						New Password
					</label>
					<input
						type="password"
						id="password"
						ref={passwordRef}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
						required
					/>
				</div>
				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm Password
					</label>
					<input
						type="password"
						id="confirmPassword"
						ref={confirmPasswordRef}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1"
						required
					/>
				</div>
				<div>
					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Reset Password
					</button>
				</div>
			</form>
		</div>
	);
};

export default ResetPassword;
