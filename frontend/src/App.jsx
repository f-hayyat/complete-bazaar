import { useSelector } from "react-redux";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CustomerHome from "./components/customer/CustomerHome";
import AddProduct from "./components/seller/AddProduct";
import SellerHome from "./components/seller/SellerHome";
import NavBar from "./nav/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./components/customer/cart/Cart";
import Orders from "./components/customer/Orders";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import AutoLogout from "./components/auth/AutoLogout";
import PaymentSuccess from "./components/common/PaymentSuccess";
import PaymentFailed from "./components/common/PaymentFailed";


function App() {
  const { userType } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div>
          <AutoLogout />
          <NavBar />
          <Routes>
            <Route
              path="/"
              element={
                userType === "seller" ? <SellerHome /> : <CustomerHome />
              }
            />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/payment-success" element={<PaymentSuccess/>} />
            <Route path="/payment-failed" element={<PaymentFailed/>} />
            
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
