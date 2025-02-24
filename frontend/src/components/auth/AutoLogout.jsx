import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const AutoLogout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const expiryTime = useSelector((state) => state.auth.expiryTime);

	useEffect(() => {
		if (!expiryTime) return;

		const currentTime = new Date().getTime();

		const remainingTime = expiryTime - currentTime;

		if (remainingTime <= 0) {
			// Token already expired
			dispatch(logout());
			navigate("/login");
		} else {
			// Set a timeout to log out when token expires
			const timeout = setTimeout(() => {
				dispatch(logout());
				navigate("/login");
			}, remainingTime);

			// Clean up timeout on component unmount
			return () => clearTimeout(timeout);
		}
	}, [expiryTime, dispatch, navigate]);

	return null; // No UI for this component
};

export default AutoLogout;
