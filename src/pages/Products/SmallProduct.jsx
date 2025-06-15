import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-[full] p-3">
      <Link  to={`/product/${product._id}`} className="relative">
        <img
          src={product.image.url}
          alt={product.name}
          className="h-50 w-full rounded"
        />
        <HeartIcon product={product} />

        <div>
          <div>
            <h2 className="flex justify-between items-center mt-2">
              <div>{product.name.substring(0, 20)}...</div>
              <span className="bg-pink-100 text-pink-800.text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
                $ {product.price}
              </span>
            </h2>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
