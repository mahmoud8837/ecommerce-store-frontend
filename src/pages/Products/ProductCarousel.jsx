import { useGetTopProductsQuery } from "../../redux/api/productsApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaCheck,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const ProductCarousel = () => {
  const { data, isLoading, error } = useGetTopProductsQuery({page: 1, limit: 12});

  const settings = {
    dots: false,
    infinite: true,
    speen: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplayspeed: 3000,
  };

  return (
    <div className="">
      {isLoading ? null : error ? (
        <Message variant="error">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="block max-lg:mx-auto shadow-lg border border-gray-800 shadow-blue-950/20  bg-radial from-gray-600/20 via-cyan-950/30 to-gray-950/20 rounded-2xl w-[20rem] min-[550px]:w-[30rem] sm:w-[36rem] md:[56rem] lg:w-[33rem] min-2xl:w-[45rem]"
        >
          {data.products.map((p) => (
            <div key={p._id}>
              <img
                src={`${BACKEND_URL}${p.image.url}`}
                alt={p.name}
                className="w-full max-w-[100%] rounded-b-none rounded-lg object-cover h-[30rem] max-[550px]:h-[10rem] "
              />
              <div className="flex flex-col sm:flex-row p-4 justify-between text-balance relative">
                <div className="one sm:max-w-[75%]">
                  <div className="max-sm:flex justify-between">
                    <h2 className="sm:max-w-[75%]">{p.name}</h2>
                    <p className="block text-nowrap">$ {p.price}</p>
                  </div> <br /> <br />
                  <p className="sm:max-w-[75%]">{p.description.substring(0, 170)}...</p>
                </div>
                <div className="flex justify-start flex-col mr-4 sm:absolute right-0 max-w-20% text-balance h-full">
                  <div className="one h-fit max-sm:flex flex-col items-start max-sm:pt-5 w-full">
                    <h1 className="flex items-center mb-2 sm:mb-4">
                      <FaStore size={20} className="mr-2 text-white" /> Brand: {p.brand}
                    </h1>
                    <h1 className="flex items-center mb-2 sm:mb-4">
                      <FaClock size={20} className="mr-2 text-white" /> Added: {moment(p.createdAt).fromNow()}
                    </h1>
                    <h1 className="flex items-center mb-2 sm:mb-4">
                      <FaStar size={20} className="mr-2 text-white" /> Reviews: {p.numReviews}
                    </h1>
                  </div>
                  <div className="two">
                    <h1 className="flex items-center mb-2 sm:mb-4">
                      <FaStar size={20} className="mr-2 text-white" /> Rating: {Math.round(p.rating)}
                    </h1>
                    <h1 className="flex items-center mb-2 sm:mb-4">
                      <FaShoppingCart size={20} className="mr-2 text-white" /> Quantity: {p.quantity}
                    </h1>
                    <h1 className="flex items-center sm:mb-4">
                      <FaBox size={20} className="mr-2 text-white" /> In Stock: {p.countInStock}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
