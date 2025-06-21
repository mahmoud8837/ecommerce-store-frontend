import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  useGetFavouriteProductsQuery,
  useAddFavouriteProductMutation,
  useRemoveFavouriteProductMutation,
} from "../../redux/api/usersApiSlice";

const HeartIcon = ({ product }) => {
  const { data, refetch } = useGetFavouriteProductsQuery();
  // console.log(data)
  const [addFavourite] = useAddFavouriteProductMutation();
  const [removeFavourite] = useRemoveFavouriteProductMutation();

  const handleAddFavourite = async (productId) => {
    try {
      const res = await addFavourite(productId);
      // console.log(res);
      if (res?.error) {
        toast.error(
          res?.error?.data?.message == "Not authorized, no token, please log in"
          ? "Log in to add to your favourites"
          : res?.error?.data?.message
        );
        refetch();
      }
      toast.success(res.data.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      refetch();
    }
  };

  const handleRemoveFavourite = async (productId) => {
    try {
      const res = await removeFavourite(productId);
      // console.log(res);
      if (res?.error) {
        toast.error(
          res?.error?.data?.message == "Not authorized, no token, please log in"
            ? "Log in to add to your favourites"
            : res?.error?.data?.message
        );
        refetch();
      }
      toast.success(res.data.message);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      refetch();
    }
  };

  return (
    <>
      {data?.products?.find(
        (id) => id.toString() == product._id.toString()
      ) ? (
        <button
          onClick={() => {
            handleRemoveFavourite(product._id);
          }}
          className="absolute top-2 right-5 cursor-pointer bg-stone-950/30 p-3 rounded-lg"
        >
          <FaHeart className="text-pink-500" />
        </button>
      ) : (
        <button
          onClick={() => {
            handleAddFavourite(product._id);
          }}
          className="absolute top-2 right-5 cursor-pointer bg-stone-950/30 p-3 rounded-lg"
        >
          <FaRegHeart className="text-white" />
        </button>
      )}
    </>
  );
};

export default HeartIcon;
