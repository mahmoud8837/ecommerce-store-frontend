import { Link, useParams } from "react-router-dom";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";
import { useSelector } from "react-redux";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const Order = () => {
  const params = useParams();
  const orderId = params.id;

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDelivered }] =
    useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
      const loadingPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order?.order && !order.order?.isPaid) {
        if (!window.paypal) {
          loadingPayPalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error?.message || "Error");
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onError(err) {
    toast.error(err.message || "Error");
  }

  const deliverHandler = async () => {
    try {
      const delivered = await deliverOrder(orderId);
      if (delivered?.error) {
        toast.error(delivered?.error?.data?.message || delivered?.message || "Error");
      } else {
        toast.success("Order is marked as delivered successfully")
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.message || "Error");
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant={"error"}>
      {error?.data?.message || error?.message || "Error"}
    </Message>
  ) : (
    <div className="flex flex-col lg:ml-[6rem] md:flex-row p-3">
      <div className="md:w-2/3 md:pr-4">
        <div className="border border-gray-500 mt-5 pb-4 mb-5 text-nowrap">
          {order?.orderItems?.length == 0 ? (
            <Message variant={"error"}>Order is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-[80%]">
                <thead className="border-b-2 border-gray-500 text-nowrap">
                  <tr>
                    <th className="p-2">image</th>
                    <th className="p-2">product</th>
                    <th className="p-2 text-center">Quantity</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order?.order?.orderItems?.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <img
                          src={`${BACKEND_URL}${item.product.image.url}`}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover"
                        />
                      </td>
                      <td className="p-2 text-nowrap">
                        <Link to={`/product/${item._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="p-2 text-center">{item.qty}</td>
                      <td className="p-2 text-center">
                        $ {item.product.price}
                      </td>
                      <td className="p-2 text-center">
                        $ {item.product.price * item.qty}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="md-1/3">
        <div className="mt-5 border border-gray-500 pb-4 mb-4 p-3">
          <h2 className="text-xl font-bold mb-2">Shipping</h2>
          <p className="mb-4 mt-4">
            <strong className="text-pink-500">Order:</strong> {order.order._id}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Name: </strong>{" "}
            {order.order.user.username}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Email: </strong>{" "}
            {order.order.user.email}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Address: </strong>{" "}
            {order.order.shippingAddress.address},{" "}
            {order.order.shippingAddress.city}{" "}
            {order.order.shippingAddress.postalCode},{" "}
            {order.order.shippingAddress.country}
          </p>
          <p className="mb-4">
            <strong className="text-pink-500">Method: </strong>
            {order.order.paymentMethod}
          </p>
          {order.order.isPaid ? (
            <Message variant={"success"}>
              Paid on {order?.order?.paidAt}
            </Message>
          ) : (
            <Message variant={"error"}>Not paid</Message>
          )}
        </div>
        <div className="border border-gray-500 p-2">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>$ {order.order.itemsPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>$ {order.order.shippingPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Tax</span>
            <span>$ {order.order.taxPrice}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>$ {order.order.totalPrice}</span>
          </div>
        </div>
        {!order.order.isPaid && (
          <div>
            {loadingPay && <Loader />}
            {isPending ? (
              <Loader />
            ) : (
              <div>
                <div>
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {loadingDelivered && <Loader />}
        {userInfo &&
          userInfo.isAdmin &&
          order.order.isPaid &&
          !order.order.isDelivered && (
            <div>
              <button
                className="bg-pink-600 w-full text-white py-2 rounded-b-lg hover:bg-pink-700 duration-[.3s] cursor-pointer"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Order;
