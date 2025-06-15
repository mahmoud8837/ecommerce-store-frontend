import { Link, useNavigate } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { FaArrowRight, FaShoppingCart, FaTrash } from "react-icons/fa";
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetCartQuery,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const [deleteFromCart] = useDeleteFromCartMutation();
  const [addToCart] = useAddToCartMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();

  const addToCartHandler = async () => {
    try {
      const productAdded = await addToCart({
        productId: product._id,
        qty: 1,
      }).unwrap();
      if (productAdded.error) {
        toast.error(
          productAdded?.error?.data?.message ||
            productAdded?.error?.message ||
            "Error"
        );
      } else {
        toast.success(productAdded.message);
        refetchCart();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  const deleteFromCartHandler = async () => {
    try {
      const productDeleted = await deleteFromCart(product._id).unwrap();
      if (productDeleted.error) {
        toast.error(
          productDeleted?.error?.data?.message ||
            productDeleted?.error?.message ||
            "Error"
        );
      } else {
        refetchCart();
        toast.success(productDeleted.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  return (
    <div className="w-[full] p-3">
      <div className="relative">
        <div>
          <span className="bg-stone-800 absolute bottom-40 right-0 text-pink-800.text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-stone-800 dark:text-pink-400">
            {product.brand}
          </span>
          <img
            src={product.image.url}
            alt={product.name}
            className="h-60 w-full rounded"
          />
          <HeartIcon product={product} />

          <div>
            <div>
              <h2 className="flex justify-between font-semibold items-center mt-2">
                <div>{product.name.substring(0, 20)}...</div>
                <span className="text-pink-500 font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  {product?.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </h2>
              <p className="mb-3 font-normal text-[#cfcfcf] text-wrap">
                {product.description.substring(0, 60)} ...
              </p>
              <section className="flex justify-between items-center">
                <Link
                  to={`/product/${product._id}`}
                  className="inline-flex items-center my-2 px-3 py-1 font-medium bg-pink-700 hover:bg-pink-800 duration-[.3s] rounded-lg hover:[&_svg]:ml-2 hover:[&_svg]:mr-0"
                >
                  Read More
                  <FaArrowRight className="pl-4 text-3xl duration-[.3s] mr-2" />
                </Link>
                {cartData?.cart?.products?.find(
                  (p) => p._id.toString() === product._id.toString()
                ) ? (
                  <button
                    onClick={deleteFromCartHandler}
                    disabled={product?.countInStock == 0}
                    className={`bg-red-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-red-700 duration-[.3s]`}
                  >
                    <FaTrash />
                  </button>
                ) : (
                  <button
                    onClick={addToCartHandler}
                    disabled={product?.countInStock == 0}
                    className={`bg-pink-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-pink-700 duration-[.3s]`}
                  >
                    <FaShoppingCart />
                  </button>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
