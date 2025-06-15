import { useState } from "react";
import {
  useDeleteReviewMutation,
  useGetReviewedProductsQuery,
  useGetTopProductsQuery,
} from "../../redux/api/productsApiSlice";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import SmallProduct from "./SmallProduct";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
  refetch,
}) => {
  const { data, isLoading } = useGetTopProductsQuery({ page: 1, limit: 6 });
  const [activeTab, setActiveTab] = useState(1);
  const [productId, setProductId] = useState(null);
  const [deleteReview] = useDeleteReviewMutation();
  const { refetch: refetchReviewedProducts } = useGetReviewedProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  const handleTabClick = (tabNum) => {
    setActiveTab(tabNum);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure that you want to delete your review")) {
      try {
        const deletedReview = await deleteReview(product._id);
        console.log(deletedReview);
        if (deletedReview.error) {
          toast.error(deletedReview?.error?.data?.message);
        } else {
          toast.success("Reveiw deleted successfully");
          refetch();
          refetchReviewedProducts();
        }
      } catch (error) {
        toast.error(error?.data?.message || error?.message || "Error");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <section className="md:mr-[5rem] w-fit max-md:text-center max-md:flex max-md:w-full rounded-lg max-md:bg-pink-600 text-nowrap">
        <div
          className={`flex-1 p-4 max-md:p-2 cursor-pointer max-md:text-sm text-lg max-md:rounded-l-lg max-md:duration-[.3s] ${
            activeTab == 1
              ? "font-bold max-md:bg-white max-md:text-pink-600"
              : "max-md:hover:bg-pink-700"
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Review
        </div>
        <div
          className={`flex-1 p-4 max-md:p-2 max-md:border-x-2 max-md:duration-[.3s] border-black cursor-pointer max-md:text-sm text-lg ${
            activeTab == 2
              ? "font-bold max-md:bg-white max-md:text-pink-600"
              : "max-md:hover:bg-pink-700"
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </div>
        <div
          className={`flex-1 p-4 max-md:p-2 cursor-pointer max-md:duration-[.3s] max-md:text-sm text-lg max-md:rounded-r-lg ${
            activeTab == 3
              ? "font-bold max-md:bg-white max-md:text-pink-600"
              : "max-md:hover:bg-pink-700"
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </div>
      </section>

      {activeTab == 1 && (
        <section className="grow">
          <div className="mt-4">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <div className="my-2">
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    name="rating"
                    required
                    className="p-2 border rounded-lg bg-stone-800/40 text-white w-full md:w-[60%]"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    id="rating"
                  >
                    <option
                      hidden
                      defaultChecked
                      className="bg-sky-950"
                      value="Select"
                    >
                      Select
                    </option>
                    <option className="bg-sky-950" value="1">
                      Inferior
                    </option>
                    <option className="bg-sky-950" value="2">
                      Decent
                    </option>
                    <option className="bg-sky-950" value="3">
                      Great
                    </option>
                    <option className="bg-sky-950" value="4">
                      Excellent
                    </option>
                    <option className="bg-sky-950" value="5">
                      Exceptional
                    </option>
                  </select>
                </div>
                <div className="my-2">
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    name="comment"
                    rows={3}
                    id="comment"
                    value={comment}
                    placeholder="Write a comment"
                    className="rounded-lg resize-none w-full md:w-[60%] bg-stone-800/40 p-2 text-white"
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-pink-700 duration-[.3s]"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please{" "}
                <Link className="font-bold hover:underline" to={"/login"}>
                  log in
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        </section>
      )}
      {activeTab == 2 && (
        <section className="grow">
          <div className="mt-4">
            {product.reviews.length == 0 && <p>No Reviews</p>}
          </div>
          <div>
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1a1a1a] relative p-4 rounded-lg mb-5 md:w-[60%]"
              >
                <div className="flex justify-between">
                  <strong className="text-[#b0b0b0]">{review.name}</strong>
                  <p className="text-[#b0b0b0]">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>
                <p className="my-2">{review.comment}</p>
                <Ratings value={review.rating} />
                {userInfo._id.toString() == review.user.toString() && (
                  <button
                    onClick={handleDelete}
                    className="absolute right-4 bottom-4 bg-red-600 hover:bg-red-700 duration-[.3s] px-2 text-md py-2 rounded-lg cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {activeTab == 3 && (
        <section className="grow grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:mr-[2rem]">
          {data.products.map((product) => (
            <div
              key={product._id}
              onMouseMove={() => {
                setProductId(product._id);
              }}
              onMouseOut={() => {
                setProductId(null);
              }}
              className={`rounded-lg duration-[.3s] w-full border border-gray-50/0 ${
                productId && product._id !== productId
                  ? "blur-[2px] opacity-30 scale-90"
                  : "hover:blur-none hover:opacity-100 hover:border-gray-600 hover:shadow-lg shadow-cyan-950/90"
              }`}
            >
              <SmallProduct product={product} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ProductTabs;
