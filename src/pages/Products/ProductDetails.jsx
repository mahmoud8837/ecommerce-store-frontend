import { useParams, Link, useNavigate } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useGetReviewedProductsQuery,
} from "../../redux/api/productsApiSlice";
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetCartQuery,
} from "../../redux/api/usersApiSlice";
import { useState } from "react";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import Loader from "../../components/Loader";
import { useSelector } from "react-redux";
import HeartIcon from "./HeartIcon";
import moment from "moment";
import Ratings from "./Ratings";
import Message from "../../components/Message";
import ProductTabs from "./ProductTabs";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const ProductDetails = () => {
  const { id } = useParams();

  const { data, isLoading, refetch, error } = useGetProductDetailsQuery(id);
  const { refetch: refetchReviewedProducts } = useGetReviewedProductsQuery();
  const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();
  const [deleteFromCart, {isLoading: deletingFromCart}] = useDeleteFromCartMutation();

  const [qty, setQty] = useState(1);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const reviewed = await createReview({
        productId: id,
        comment,
        rating,
      }).unwrap();
      if (reviewed?.error) {
        toast.error(reviewed?.error?.data?.message);
      } else {
        toast.success("Review created successfully");
        refetch();
        refetchReviewedProducts();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  const addToCartHandler = async () => {
    try {
      const productAdded = await addToCart({ productId: id, qty: qty }).unwrap();
      if (productAdded.error) {
        toast.error(
          productAdded?.error?.data?.message ||
            productAdded?.error?.message ||
            "Error"
        );
      } else {
        toast.success(productAdded.message);
        refetchCart();
        navigate("/cart")
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  const deleteFromCartHandler = async () => {
    try {
      const productDeleted = await deleteFromCart(id).unwrap();
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
    <div className="lg:ml-[6rem] p-4">
      <button
        className="bg-pink-500 px-4 mb-[2rem] cursor-pointer duration-[.3s] py-2 rounded-lg hover:bg-pink-600"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error?.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-wrap max-md:p-5 relative justify-between">
            <div className="w-full md:w-[50%] h-full relative flex items-center justify-center">
              <img
                src={`${BACKEND_URL}${data?.product?.image.url}`}
                alt={data?.product?.name}
                className={`w-full max-sm:h-[45vh] h-[60vh] md:h-full`}
              />
              <HeartIcon product={data.product} />
            </div>
            <div className="flex flex-col justify-start md:w-[50%] md:pl-5 ">
              <h2 className="text-2xl font-semibold">{data?.product?.name}</h2>
              <p className="my-4 text-[#b0b0b0]">
                {data?.product?.description}
              </p>
              <p className="text-5xl my-4 font-extrabold">
                $ {data?.product?.price}
              </p>
              <div className="flex justify-start items-center gap-15 text-balance h-full">
                <div className="one h-fit max-sm:flex flex-col items-start w-fit">
                  <h1 className="flex items-center mb-2 sm:mb-4">
                    <FaStore size={20} className="mr-2 text-white" /> Brand:{" "}
                    {data?.product?.brand}
                  </h1>
                  <h1 className="flex items-center mb-2 sm:mb-4">
                    <FaClock size={20} className="mr-2 text-white" /> Added:{" "}
                    {moment(data?.product?.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-2 sm:mb-4">
                    <FaStar size={20} className="mr-2 text-white" /> Reviews:{" "}
                    {data?.product?.numReviews}
                  </h1>
                </div>
                <div className="two">
                  <h1 className="flex items-center mb-2 sm:mb-4">
                    <FaStar size={20} className="mr-2 text-white" /> Rating:{" "}
                    {Math.round(data?.product?.rating)}
                  </h1>
                  <h1 className="flex items-center mb-2 sm:mb-4">
                    <FaShoppingCart size={20} className="mr-2 text-white" />{" "}
                    Quantity: {data?.product?.quantity}
                  </h1>
                  <h1 className="flex items-center sm:mb-4">
                    <FaBox size={20} className="mr-2 text-white" /> In Stock:{" "}
                    {data?.product?.countInStock}
                  </h1>
                </div>
              </div>
              <div className="flex justify-between flex-wrap">
                <Ratings
                  value={data?.product?.rating}
                  color="yellow-500"
                  text={`${data?.product?.numReviews} reviews`}
                />
                {data?.product?.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="p-2 w-[6rem] rounded-lg bg-stone-900/90 text-white"
                    >
                      {[...Array(data?.product?.quantity).keys()].map((x) => (
                        <option
                          className="bg-gray-900"
                          key={x + 1}
                          value={x + 1}
                        >
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="btn-container">
                {cartData?.cart?.products?.find(
                  (p) => p._id.toString() === id.toString()
                ) ? (
                  <button
                    onClick={deleteFromCartHandler}
                    disabled={data?.product?.countInStock == 0}
                    className={`bg-red-600 text-white py-2 px-4 rounded-lg mt-4 cursor-pointer hover:bg-red-700 duration-[.3s]`}
                  >
                    {deletingFromCart ? "Deleting From Cart" : "Delete From Cart"}
                  </button>
                ) : (
                  <button
                    onClick={addToCartHandler}
                    disabled={data?.product?.countInStock == 0}
                    className={`bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 cursor-pointer hover:bg-pink-700 duration-[.3s]`}
                  >
                    {addingToCart ? "Adding To Cart" : "Add To Cart"}
                  </button>
                )}
              </div>
            </div>
            <div className="mt-[5rem] w-full flex flex-wrap items-start justify-between">
              <ProductTabs
                loadingProductReview={loadingProductReview}
                userInfo={userInfo}
                submitHandler={submitHandler}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={data.product}
                refetch={refetch}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
