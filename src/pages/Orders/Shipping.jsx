import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { savePaymentMethod, saveShippingAddress } from "../../redux/features/payment/paymentSlice";
import ProgressSteps from "../../components/ProgressSteps";

const Shipping = () => {
  const {payment} = useSelector((state) => state.payment);
  const shippingAddress = payment?.shippingAddress;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Payment

  useEffect(() => {
    if (!shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  return (
    <section className="mt-[2rem] lg:ml-[6rem] text-white mb-[5rem]">
      <ProgressSteps step1 step2 />
      <div className="flex justify-center mt-[2rem] mx-auto lg:items-start items-center flex-col w-full">
        <div className="max-sm:w-[80%] w-[50%] md:w-[50%] lg:w-[50%] mx-auto lg:pr-[6rem]">
          <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
          <form
            className="container"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch(saveShippingAddress({ address, city, postalCode, country }));
              dispatch(savePaymentMethod(paymentMethod));
              navigate("/placeorder")
            }}
          >
            <div className="my-[1rem]">
              <label htmlFor="address" className="block text-sm font-medium">
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Enter address"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label htmlFor="country" className="block text-sm font-medium">
                Country
              </label>
              <input
                type="text"
                id="country"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label htmlFor="city" className="block text-sm font-medium">
                City
              </label>
              <input
                type="text"
                id="city"
                placeholder="Enter city"
                value={city}
                required
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>

            <div className="my-[1rem]">
              <label htmlFor="postalcode" className="block text-sm font-medium">
                Postalcode
              </label>
              <input
                type="number"
                id="postalcode"
                min={1}
                placeholder="Enter postalcode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="mt-1 p-2 bg-stone-800/40 border foucs:border-none border-gray-200/20 text-white rounded w-full"
              />
            </div>
            <div className="my-[1rem]">
              <label htmlFor="method" className="block text-sm font-medium">
                Select Method
              </label>
              <div className="mt-2">
                <label htmlFor="radio" className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="radio"
                    className="text-pink-500 ring-offset-1"
                    value={"PayPal"}
                    checked={paymentMethod === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="ml-2 cursor-pointer">
                    PayPal or Credit Card
                  </span>
                </label>
              </div>
            </div>
            <button
              type={"submit"}
              className="bg-pink-600 text-white w-full px-4 py-2 rounded-full cursor-pointer my-2 hover:bg-pink-700 transition-all duraion-[.3s] ease-in-out"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
