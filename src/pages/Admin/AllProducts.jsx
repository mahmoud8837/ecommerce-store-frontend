import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAllProductsQuery } from "../../redux/api/productsApiSlice";
import AdminMenu from "./AdminMenu";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaArrowRight } from "react-icons/fa6";

const AllProducts = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useAllProductsQuery({
    page,
    limit: 6,
  });
  const paginationArray = [];
  const navigate = useNavigate();

  const [productId, setProductId] = useState(null);

  useEffect(() => {
    refetch();
  }, [navigate]);

  if (data) {
    for (let i = 1; i <= data.pagesCount; i++) {
      paginationArray.push(i);
    }
  }

  if (isLoading) {
    return (
      <div className="lg:mx-[6rem] ">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className="lg:mx-[6rem] ">Error loading products</div>;
  }

  return (
    <div className="lg:mx-[6rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="p-4 grow">
        <div className="h-12 text-2xl font-semibold">
          All Products ({data.productsCount})
        </div>
        <div className="grid grid-cols-1 xl:p-10 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product) => (
            <div
              key={product._id}
              id={productId}
              to={`admin/product/update/${product._id}`}
              className={`block mb-4 overflow-hidden
              shadow-md border border-gray-500/20 rounded-lg hover:[&_img]:scale-[1.1] hover:[&_img]:rotate-[0deg] duration-[.3s]
              hover:shadow-pink-800/30 ${
                productId && product._id !== productId
                  ? "blur-[2px] opacity-40 scale-[.97]"
                  : "hover:blur-none"
              }`}
              onMouseMove={() => {
                // console.log(productId);
                setProductId(product._id);
              }}
              onMouseOut={() => {
                setProductId("");
              }}
            >
              <div>
                <div className="h-60 m-3 rounded-t-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="w-full h-full object-cover duration-[.3s] rounded-lg rounded-b-none"
                  />
                </div>
                <hr className="mx-4 mt-4 text-gray-400" />
                <div className="p-4">
                  <div className="flex flex-col justify-around">
                    <div className="flex justify-between items-center">
                      <h5 className="text-xl font-semibold mb-2">
                        {product.name.substring(0, 10)}...
                      </h5>
                      <p className="text-gray-400 text-sm">
                        {moment(product.createdAt).format(
                          "MMMM Do YYYY, h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 h-[7rem]">
                    {product?.description?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center my-2 px-3 py-2 font-semibold bg-pink-700 hover:bg-pink-800 duration-[.3s] rounded-lg hover:[&_svg]:ml-2 hover:[&_svg]:mr-0"
                    >
                      Update Product
                      <FaArrowRight className="pl-4 text-3xl duration-[.3s] mr-2" />
                    </Link>
                    <p>$ {product.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {data.pagesCount != 1 && (
          <ul className="flex items-center justify-center gap-2 rounded-lg flex-wrap">
            {paginationArray.map((i) => (
              <li
                key={i}
                className={`border-2 border-pink-700 text-pink-600 hover:text-white duration-[.3s] ${
                  data.page == i ? "bg-pink-600 text-white" : null
                } hover:bg-pink-600 font-bold block px-4 rounded py-2 cursor-pointer`}
                onClick={() => setPage(i)}
              >
                {i}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
