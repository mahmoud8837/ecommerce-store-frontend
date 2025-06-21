import { useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useState } from "react";
import ProductById from "./ProductById";
import { Link } from "react-router-dom";
import { useGetReviewedProductsQuery } from "../../redux/api/productsApiSlice";

const ReviewedProducts = () => {
  const { data, isLoading, error } = useGetReviewedProductsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const [productId, setProductId] = useState(null);

  return (
    <div className="lg:ml-[6rem] p-4">
      <h1 className="text-2xl font-semibold uppercase mb-2">
        Reviewed Products
      </h1>

      {!userInfo ? (
        <Message variant={"error"}>
          Please{" "}
          <Link className="font-bold hover:underline" to={"/login"}>
            log in
          </Link>{" "}
          to see products you reviewed
        </Message>
      ) : error ? (
        <Message variant={"error"}>{error?.data?.message || "Error"}</Message>
      ) : isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-[2rem]">
          {Array.from(data?.products)
            ?.reverse()
            .map((product) => (
              <div
                key={product}
                onMouseMove={() => {
                  setProductId(product);
                }}
                onMouseOut={() => {
                  setProductId(null);
                }}
                className={`rounded-lg bg-conic-135 from-gray-500/10 via-cyan-950/10 to-gray-950/20 duration-[.3s] border border-gray-50/0 ${
                  productId && product !== productId
                    ? "blur-[0px] opacity-60 scale-95"
                    : "hover:blur-none hover:opacity-100 hover:border-gray-600 hover:shadow-lg shadow-cyan-950/90"
                }`}
              >
                <ProductById key={product} id={product} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ReviewedProducts;
