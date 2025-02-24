const Order = ({ order, products }) => {
  // Map order products to full product details
  const productsInOrder = order.products.map((productId) => 
    products.find((p) => p._id === productId)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="border-b pb-2">
          <p className="text-sm text-gray-500">
            Order Date: {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="font-semibold">Total Amount: Rs. {order.totalAmount}</p>
        </div>
        
        <div className="space-y-3">
          {productsInOrder.map((product) => (
            <div key={product._id} className="flex items-center space-x-3">
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL}/` + product.imageUrl} 
                alt={product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">Rs. {product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;