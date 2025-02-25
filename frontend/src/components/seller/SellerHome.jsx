import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellerProducts } from "../../store/slices/sellerSlice";
import ErrorMessages from "../common/ErrorMessages";
import SellerProduct from "./SellerProduct";
import { deleteProduct } from "../../store/slices/sellerSlice";

const SellerHome = () => {
	const { products, isLoading, errorMessages } = useSelector(
		(state) => state.seller
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchSellerProducts());
	}, [dispatch]);

	const handleDeleteProduct = async (productId) => {
		const token = localStorage.getItem("token");
		const response = await fetch(
			`${import.meta.env.VITE_API_BASE_URL}/api/seller/products/${productId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (response.status === 200) {
			dispatch(deleteProduct(productId));
		} else {
			const data = await response.json();
			data;
		}
	};

	if (isLoading) {
		return <div className="text-center mt-8">Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">My Products</h1>
			<ErrorMessages errorMessages={errorMessages} />
			{!products || products.length === 0 ? (
				<p>No products found. Start by adding some products.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{products.map((product) => (
						<SellerProduct
							key={product._id}
							product={product}
							handleDeleteProduct={handleDeleteProduct}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default SellerHome;
