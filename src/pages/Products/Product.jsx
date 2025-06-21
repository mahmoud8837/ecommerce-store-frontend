import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const Product = ({ product }) => {
  return (
    <div className="p-3 relative">
      <div className="relative">
        <img
          src={`${BACKEND_URL}${product.image.url}`}
          alt={product.name}
          className="rounded w-full h-[20rem]"
        />
        <HeartIcon product={product} /> 
        <div className="p-4">
          <div>
            <h2 className="flex justify-between items-center">
              <Link to={`/product/${product._id}`} className="text-lg">{product.name.substring(0, 24)}...</Link>
              <span className="bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">$ {product.price}</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
