import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: localStorage.getItem("token") ? true : false,
	token: localStorage.getItem("token") || null,
	userType: localStorage.getItem("userType") || null,
	expiryTime: localStorage.getItem("expiryTime") || null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		login: (state, action) => {
			"state: ", state, "action: ", action.payload;
			state.isLoggedIn = true;
			state.token = action.payload.token;
			state.userType = action.payload.userType;
			state.expiryTime = action.payload.expiryTime;
			localStorage.setItem("token", action.payload.token);
			localStorage.setItem("userType", action.payload.userType);
			localStorage.setItem("expiryTime", action.payload.expiryTime);
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.token = null;
			state.userType = null;
			state.expiryTime = null;
			localStorage.removeItem("token");
			localStorage.removeItem("userType");
			localStorage.removeItem("expiryTime");
		},
	},
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
