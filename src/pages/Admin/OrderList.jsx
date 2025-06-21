import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import { Link } from "react-router-dom";
import AdminMenu from "./AdminMenu";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const OrderList = ({ hidden }) => {
  const { data, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="p-2 lg:ml-[6rem]">
      <h2 className={`text-2xl font-semibold mb-4 ${hidden ? "hidden" : " "}`}>
        Orders
      </h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"error"}>
          {error?.data?.message || error?.message || "Error"}
        </Message>
      ) : (
        <div className=" overflow-x-auto">
          <AdminMenu />
          <table className="w-full">
            <thead className="border border-gray-500">
              <tr>
                <th className="py-2">ITEMS</th>
                <th className="py-2">ID</th>
                <th className="py-2">USER</th>
                <th className="py-2">DATE</th>
                <th className="py-2">TOTAL</th>
                <th className="py-2">PAID</th>
                <th className="py-2">DELIVERED</th>
              </tr>
            </thead>
            <tbody className=" mb-4 text-center">
              {data?.orders.map((order) => (
                <tr key={order._id} className="mb-5">
                  <td className="p-2">
                    <img
                      src={`${BACKEND_URL}${order.orderItems[0].product.image.url}`}
                      alt={order.orderItems[0].product.name}
                      className="h-16 w-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2">{order._id}</td>
                  <td className="p-2">{order.user.username}</td>
                  <td className="p-2 text-nowrap px-4  ">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-2 text-nowrap px-4  ">
                    $ {order.totalPrice}
                  </td>
                  <td className="p-2">
                    {order.isPaid ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full mx-auto">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full mx-auto">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="p-2  ">
                    {order.isDelivered ? (
                      <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full mx-auto">
                        Completed
                      </p>
                    ) : (
                      <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full mx-auto">
                        Pending
                      </p>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <Link
                      to={`/order/${order._id}`}
                      className="cursor-pointer bg-pink-600 duration-[.3s] px-4 py-2 rounded-lg text-nowrap hover:bg-pink-700"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderList;
