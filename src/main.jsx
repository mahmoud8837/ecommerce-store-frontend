import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, createRoutesFromElements, Route } from "react-router";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./redux/store.js";
import { Provider } from "react-redux";
import {PayPalScriptProvider} from "@paypal/react-paypal-js"
import Login from "./pages/Auth/Login.jsx";
import NotfoundPage from "./components/NotfoundPage.jsx";
import Register from "./pages/Auth/Register.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./pages/User/Profile.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";
import UserList from "./pages/Admin/UserList.jsx";
import CategoryList from "./pages/Admin/CategoryList.jsx";
import ProductList from "./pages/Admin/ProductList.jsx";
import ProductUpdate from "./pages/Admin/ProductUpdate.jsx";
import AllProducts from "./pages/Admin/AllProducts.jsx";
import Home from "./pages/Home.jsx";
import Favourites from "./pages/Products/Favourites.jsx";
import ProductDetails from "./pages/Products/ProductDetails.jsx";
import ReviewedProducts from "./pages/Products/ReviewedProducts.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Shipping from "./pages/Orders/Shipping.jsx";
import PlaceOrder from "./pages/Orders/PlaceOrder.jsx";
import Order from "./pages/Orders/Order.jsx";
import UserOrders from "./pages/Orders/UserOrders.jsx";
import OrderList from "./pages/Admin/OrderList.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotfoundPage />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" index={true} element={<Home />} />
      <Route path="/favourite" element={<Favourites />} />
      <Route path="/reviewedproducts" element={<ReviewedProducts />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/shop" element={<Shop />} />

      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/user-orders" element={<UserOrders />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route path="userlist" element={<UserList />} />
        <Route path="categorylist" element={<CategoryList />} />
        <Route path="productlist" element={<ProductList />} />
        <Route path="product/update/:_id" element={<ProductUpdate />} />
        <Route path="allproductslist" element={<AllProducts />} />
        <Route path="orderlist" element={<OrderList />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PayPalScriptProvider>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  </Provider>
);
