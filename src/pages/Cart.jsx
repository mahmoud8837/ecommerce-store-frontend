import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteFromCartMutation,
  useGetCartQuery,
  useUpdateAmountInCartMutation,
} from "../redux/api/usersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [updateAmountInCart] = useUpdateAmountInCartMutation();
  const [productId, setProductId] = useState(null);
  const [deleteFromCart] = useDeleteFromCartMutation();

  useEffect(() => {
    refetch();
  }, [navigate, refetch]);

  const updateCartHandler = async (productId, qty) => {
    try {
      const updatedProductAmount = await updateAmountInCart({
        productId,
        qty,
      }).unwrap();
      if (updatedProductAmount?.error) {
        toast.error(
          updatedProductAmount?.error?.data?.message ||
            updatedProductAmount?.error?.message ||
            "Error updating product amount"
        );
      } else {
        toast.success(updatedProductAmount?.message);
        refetch();
      }
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Error updating product amount"
      );
    }
  };

  const deleteFromCartHandler = async (id) => {
    try {
      const productDeleted = await deleteFromCart(id).unwrap();
      if (productDeleted.error) {
        toast.error(
          productDeleted?.error?.data?.message ||
            productDeleted?.error?.message ||
            "Error"
        );
      } else {
        refetch();
        toast.success(productDeleted.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <div className="lg:ml-[6rem] p-4  overflow-hidden">
      <div className="text-2xl font-semibold mb-4">Shopping Cart</div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"error"}>
          {error?.data?.message == "Not authorized, no token, please log in" ? (
            <>
              Please{" "}
              <Link className="font-bold hover:underline" to={"/login"}>
                log in
              </Link>{" "}
              to see your cart items
            </>
          ) : (
            error?.data?.message || error?.message || "Error"
          )}
        </Message>
      ) : data ? (
        <>
          {data?.cart?.products?.length == 0 ? (
            <div>
              Your cart is empty{" "}
              <Link className="hover:underline text-pink-500" to={"/shop"}>
                Go To Shop
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col lg:w-[80%] overflow-auto">
                {data.cart.products.map((item) => (
                  <div
                    key={item._id}
                    className={`flex items-center mb-[1rem] w-full rounded-lg sm:px-2 duration-[.3s] pb-2 ${
                      productId && productId == item._id
                        ? "bg-gray-800/40"
                        : null
                    }`}
                    onMouseMove={() => {
                      setProductId(item._id);
                    }}
                    onMouseLeave={() => {
                      setProductId(null);
                    }}
                  >
                    <div className="w-[5rem] h-[5rem]">
                      <img
                        src={item.product.image.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 ml-4">
                      <Link
                        to={`/product/${item._id}`}
                        className="text-pink-500"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-2 text-white">
                        {item.product.brand}
                      </div>
                      <div className="mt-2 text-white font-bold">
                        $ {item.product.price}
                      </div>
                    </div>
                    <div className="w-24">
                      <select
                        id="updatecart"
                        className="p-1 border rounded-lg bg-stone-800/40 text-white w-full"
                        onChange={(e) =>
                          updateCartHandler(item._id, e.target.value)
                        }
                      >
                        <option value={item.qty} hidden defaultChecked>
                          {item.qty}
                        </option>
                        {[...Array(item.product.quantity).keys()].map((q) => (
                          <option key={q} className="bg-sky-950" value={q + 1}>
                            {q + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <button
                        onClick={() => deleteFromCartHandler(item._id)}
                        disabled={data?.product?.countInStock == 0}
                        className={`bg-red-600 ml-[1rem] text-white p-2 rounded-lg cursor-pointer hover:bg-red-700 duration-[.3s]`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-8 w-full">
                  <div className="p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">
                      items (
                      {data.cart.products.reduce(
                        (acc, item) => acc + item.qty,
                        0
                      )}
                      )
                    </h2>
                    <div className="text-2xl font-bold">
                      $ {data.cart.itemsPrice}
                    </div>
                    <button
                      onClick={checkoutHandler}
                      className="bg-pink-600 mt-4 py-2 px-4 rounded-lg cursor-pointer hover:bg-pink-700 duration-[.3s] text-lg "
                    >
                      Proceed To Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Cart;
