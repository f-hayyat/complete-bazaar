import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerData } from "../../store/slices/customerSlice";
import ErrorMessages from "../common/ErrorMessages";
import Order from "./Order";

const Orders = () => {
  const { products, orders, isLoading, errorMessages } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  
  // Fetch customer data when component mounts
  useEffect(() => {
    dispatch(fetchCustomerData());
  }, [dispatch]);

  // Show loading state
  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  // Sort orders by date (newest first)
  let sortedOrders = [];
  if (orders) {
    sortedOrders = [...orders].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      
      {/* Show any error messages */}
      <ErrorMessages errorMessages={errorMessages} />
      
      {/* Show message if no orders, otherwise display order list */}
      {!orders || orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {sortedOrders.map((order) => (
            <Order 
              key={order._id} 
              order={order} 
              products={products} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;