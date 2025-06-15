import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";
import { Link } from "react-router-dom";

const UserOrders = () => {
  const { data, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="p-2 lg:ml-[6rem]">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant={"error"}>
          {error?.data?.message || error?.message || "Error"}
        </Message>
      ) : (
        <div className=" overflow-x-auto">
          <table className="w-full">
            <thead className="">
              <tr>
                <th className="py-2">IMAGE</th>
                <th className="py-2">ID</th>
                <th className="py-2">DATE</th>
                <th className="py-2">TOTAL</th>
                <th className="py-2">PAID</th>
                <th className="py-2">DELIVERED</th>
              </tr>
            </thead>
            <tbody className=" mb-4 text-center">
              {data?.userOrders.map((order) => (
                <tr key={order._id} className="mb-5">
                  <td className="p-2">
                    <img
                      src={order.orderItems[0].product.image.url}
                      alt={order.orderItems[0].product.name}
                      className="h-16 w-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="p-2  ">{order._id}</td>
                  <td className="p-2 text-nowrap px-4  ">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="p-2 text-nowrap px-4  ">
                    $ {order.totalPrice}
                  </td>
                  <td className="p-2  ">
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

export default UserOrders;
