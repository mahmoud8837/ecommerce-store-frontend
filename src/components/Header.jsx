import { useGetTopProductsQuery } from "../redux/api/productsApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";
import { useState } from "react";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery({
    page: 1,
    limit: 4,
  });
  const [productId, setProductId] = useState(null);
  if (data)
    if (isLoading) {
      return (
        <div className="lg:ml-[6rem]">
          <Loader />
        </div>
      );
    }
  if (error) {
    return <h1>ERROR</h1>;
  }
  return (
    <>
      <div className="flex justify-around p-5">
        <div className="hidden xl:block">
          <div className="grid grid-cols-2 ml-[2rem] p-2 border border-gray-800 gap-2  bg-radial from-gray-700/20 via-cyan-950/30 to-gray-950/20 shadow-lg shadow-cyan-950/20 rounded-lg">
            {data?.products.map((product) => (
              <div
                key={product._id}
                onMouseMove={() => {
                  setProductId(product._id);
                }}
                onMouseOut={() => {
                  setProductId(null);
                }}
                className={`rounded-lg duration-[.3s] border border-gray-50/0 ${
                  productId && product._id !== productId
                    ? "blur-[2px] opacity-30 scale-90"
                    : "hover:blur-none hover:opacity-100 hover:border-gray-600 hover:shadow-lg shadow-cyan-950/90"
                }`}
              >
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
        <ProductCarousel products={data} />
      </div>
    </>
  );
};

export default Header;
