import { useGetProductsQuery } from "../redux/api/productsApiSlice";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Message from "../components/Message";
import { useState } from "react";
import Loader from "../components/Loader";
import Product from "./Products/Product";

const Home = () => {
  const params = useParams();
  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState(null);

  const { data, isLoading, error } = useGetProductsQuery({
    page,
    limit: 12,
  });

  

  return (
    <>
      {params ? <Header /> : null}
      {isLoading ? (
        <div className="lg:ml-[6rem]">
          <Loader />
        </div>
      ) : error ? (
        <div className="lg:mx-[6rem]">
          <Message variant={"error"}>
            {error?.data?.message || error?.error || "Error"}
          </Message>
        </div>
      ) : (
        <div className="lg:ml-[6rem]">
          <div className="mt-[10rem] flex max-md:gap-3 justify-center md:justify-around items-center">
            <h1 className="text-[3rem] max-md:text-[28px]">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 duration-[.3s] hover:bg-pink-700 font-bold rounded-full py-2 px-10"
            >
              Shop
            </Link>
          </div>
          <div className="flex items-center justify-center p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-[2rem]">
              {data.products.map((product) => (
                <div
                  key={product._id}
                  onMouseMove={() => {
                    setProductId(product._id);
                  }}
                  onMouseOut={() => {
                    setProductId(null);
                  }}
                  className={`rounded-lg bg-conic-135 from-gray-500/10 via-cyan-950/10 to-gray-950/20 duration-[.3s] border border-gray-50/0 ${
                    productId && product._id !== productId
                      ? "blur-[0px] opacity-60 scale-95"
                      : "hover:blur-none hover:opacity-100 hover:border-gray-600 hover:shadow-lg shadow-cyan-950/90"
                  }`}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
