import { useNavigate } from "react-router";
import {
  useClearCartItemsMutation,
  useDeleteFromCartMutation,
  useGetCartQuery,
  useUpdateAmountInCartMutation,
} from "../../redux/api/usersApiSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import ProgressSteps from "../../components/ProgressSteps";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const PlaceOrder = () => {
  const [clearCartItems] = useClearCartItemsMutation();
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [updateAmountInCart] = useUpdateAmountInCartMutation();
  const [deleteFromCart] = useDeleteFromCartMutation();

  const { data, refetch } = useGetCartQuery();

  const { payment } = useSelector((state) => state.payment);

  const navigate = useNavigate();

  useEffect(() => {
    if (!payment?.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [payment?.paymentMethod, payment?.shippingAddress?.address, navigate]);

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
    if (window.confirm("Are you sure to delete this item")) {
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
    }
  };

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        shippingAddress: payment.shippingAddress,
        paymentMethod: payment.paymentMethod
      }).unwrap();
      await clearCartItems();
      navigate(`/order/${res._id}`)
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  return (
    <section className="mt-[2rem] lg:ml-[6rem] text-white mb-[5rem]">
      <ProgressSteps step1 step2 step3 />
      {!data?.cart || data?.cart?.products?.length == 0 ? (
        <Message variant={"error"}>Your cart is empty</Message>
      ) : (
        <div className="overflow-x-auto mt-[2rem] p-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border border-gray-400">
                <th className="px-4 py-2 text-center aligh-top border border-gray-400">
                  Image
                </th>
                <th className="py-2 text-left aligh-top border px-4 border-gray-400">
                  Product
                </th>
                <th className="px-4 py-2 text-center aligh-top border border-gray-400">
                  Quantity
                </th>
                <th className="py-2 text-left aligh-top border px-4 border-gray-400">
                  Price
                </th>
                <th className="py-2 text-left aligh-top border px-4 border-gray-400">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.cart.products.map((item) => (
                <tr
                  key={item._id}
                  className="border border-gray-500 hover:bg-gray-900/50"
                >
                  <td className="p-2 border border-gray-500">
                    <img
                      src={`${BACKEND_URL}${item.product.image.url}`}
                      alt={item.product.name}
                      className="h-16 w-16 mx-auto object-cover"
                    />
                  </td>
                  <td className="p-2 border px-4 border-gray-500 text-nowrap">
                    <Link to={`/product/${item._id}`}>{item.product.name}</Link>
                  </td>
                  <td className="p-2 border px-4 border-gray-500 text-center">
                    <div className="flex">
                      <select
                        id="updatecart"
                        className="p-1 border max-md:w-[4rem] md:w-full rounded-lg bg-stone-800/40 text-white"
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
                      <button
                        onClick={() => deleteFromCartHandler(item._id)}
                        disabled={data?.product?.countInStock == 0}
                        className={`bg-red-600 ml-[1rem] text-white p-2 rounded-lg cursor-pointer hover:bg-red-700 duration-[.3s]`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                  <td className="p2 border px-4 border-gray-500 text-left">
                    {item.product.price}
                  </td>
                  <td className="p2 border px-4 border-gray-500 text-left">
                    {(item.product.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8  px-5">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="flex flex-col md:flex-row justify-between p-8 bg-[#181818]">
          <ul className="text-lg">
            <li>
              <span className="font-semibold mb-4">Items: </span> $
              {data?.cart?.itemsPrice}
            </li>
            <li>
              <span className="font-semibold mb-4">Shipping: </span> $
              {data?.cart?.shippingPrice}
            </li>
            <li>
              <span className="font-semibold mb-4">Tax: </span> $
              {data?.cart?.taxPrice}
            </li>
            <li>
              <span className="font-semibold mb-4">Total: </span> $
              {data?.cart?.totalPrice}
            </li>
          </ul>
          {error && <Message variant={"error"}>{error?.data?.message}</Message>}
          <div>
            <h2 className="text-2xl font-semibold md:mb-4 max-md:mt-4">
              Shipping
            </h2>
            <p>
              <strong>Address: </strong>
              {payment.shippingAddress.address}, {payment.shippingAddress.city}{" "}
              {payment.shippingAddress.postalCode},{" "}
              {payment.shippingAddress.country}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold md:mb-4 max-md:mt-4">
              Payment Method
            </h2>
            <strong>Method: </strong> {payment.paymentMethod}
          </div>
        </div>
        <button
          type="button"
          disabled={data?.cart?.products?.length == 0}
          onClick={placeOrderHandler}
          className="bg-pink-600 hover:bg-pink-700 py-1 mt-4 duration-[.3s] cursor-pointer rounded-full text-lg w-full"
        >
          Place Order
        </button>
        {isLoading && <Loader />}
      </div>
    </section>
  );
};

export default PlaceOrder;
