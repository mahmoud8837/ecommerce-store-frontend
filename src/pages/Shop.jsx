import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import { useEffect, useState } from "react";
import {
  setCategories,
  setChecked,
  setProducts,
} from "../redux/features/shop/shopSlice";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const [productId, setProductId] = useState(null);
  const dispatch = useDispatch();
  const { categories, products, checked } = useSelector(
    (state) => state.shop
  );

  const [fromPrice, setFromPrice] = useState(null);
  const [toPrice, setToPrice] = useState(null);

  const [sidebarOpen, setsideBarOpen] = useState(false);
  const toggleSidebar = () => {
    setsideBarOpen(!sidebarOpen);
  };

  const categoriesQuery = useFetchCategoriesQuery();

  const filteredProdcutsQuery = useGetFilteredProductsQuery({
    checked,
    fromPrice,
    toPrice,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, fromPrice, toPrice, dispatch]);

  useEffect(() => {
      if (!filteredProdcutsQuery.isLoading) {
        dispatch(setProducts(filteredProdcutsQuery.data.products));
      }
  }, [checked, filteredProdcutsQuery.data, dispatch, fromPrice, toPrice]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProdcutsQuery?.data.products.filter(
      (product) => {
        return product.brand === brand;
      }
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProdcutsQuery?.data?.products
          .map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  return (
    <>
      <div className="lg:ml-[6rem] max-lg:p-4">
        <div className={`lg:flex text-nowrap`}>
          <button
            onClick={toggleSidebar}
            className="absolute lg:hidden z-[100] bg-pink-600 left-10 top-20 cursor-pointer hover:bg-pink-700 duration-[.3s] rounded-lg px-4 py-1"
          >
            Filter
          </button>
          <div
            className={`bg-[#151515] p-3 mt-2 mb-2 block max-lg:ease-in-out duration-[.5s] ${
              sidebarOpen
                ? "max-lg:block max-lg:mt-4 opacity-100"
                : "max-lg:h-0 max-lg:w-full max-lg:opacity-0"
            }`}
          >
            <h2 className="text-center py-2 px-4 bg-black rounded-full mb-2">
              Filter By Categories
            </h2>
            <div className="p-5">
              {categories.map((c) => (
                <div key={c._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={c._id}
                      className="rounded bg-stone-800/40 focus:outline-pink-600 focus:ring-0 border-gray-500 text-pink-500"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                    />
                    <label
                      htmlFor={c._id}
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {c.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-center py-2 px-4 bg-black rounded-full mb-2">
              Filter By Brands
            </h2>
            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <div key={brand}>
                  <div className="felx items-center mr-4 mb-2">
                    <input
                      type="radio"
                      name="brand"
                      className="bg-stone-800/40 focus:outline-pink-600 focus:ring-0 border-gray-500 text-pink-500"
                      id={brand}
                      onClick={() => {
                        handleBrandClick(brand);
                      }}
                    />
                    <label
                      htmlFor={brand}
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {brand}
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-center py-2 px-4 bg-black rounded-full mb-2">
              Filter By Price
            </h2>
            <div className="p-5 flex flex-col">
              <input
                type="number"
                min={0}
                placeholder="From"
                onChange={(e) => setFromPrice(e.target.value)}
                className="p-2 w-full mb-2 bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
              <input
                type="number"
                min={0}
                placeholder="To"
                onChange={(e) => setToPrice(e.target.value)}
                className="p-2 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
            </div>
            <div className="p-5 pt-0">
              <button
                className="w-full rounded-lg my-4 py-2 bg-pink-600 hover:bg-pink-700 duration-[.3s] cursor-pointer"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="p-3">
            <div className="h-12 text-2xl font-semibold text-center">
              ({products?.length}){" "}
              {products?.length == 1 ? "Product" : "Products"}
            </div>
            <div className="grow grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:mr-[2rem]">
              {products?.map((product) => (
                <div
                  key={product._id}
                  onMouseMove={() => {
                    setProductId(product._id);
                  }}
                  onMouseOut={() => {
                    setProductId(null);
                  }}
                  className={`rounded-lg duration-[.3s] bg-[#151515] w-full border border-gray-50/0 ${
                    productId && product._id !== productId
                      ? "opacity-30 scale-90"
                      : "hover:opacity-100 hover:border-gray-600 hover:shadow-lg shadow-cyan-950/90"
                  }`}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
