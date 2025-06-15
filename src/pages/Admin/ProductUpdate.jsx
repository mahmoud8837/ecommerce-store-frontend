import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "../../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState(productData?.product.image || "");
  const [name, setName] = useState(productData?.product.name || "");
  const [description, setDescription] = useState(
    productData?.product.description || ""
  );
  const [price, setPrice] = useState(productData?.product.price || "");
  const [brand, setBrand] = useState(productData?.product.brand || "");
  const [stock, setStock] = useState(productData?.product.countInStock || "");
  const [category, setCategory] = useState(productData?.product.category || "");
  const [quantity, setQuantity] = useState(productData?.product.quantity || "");

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData.product._id) {
      setName(productData.product.name);
      setDescription(productData.product.description);
      setBrand(productData.product.brand);
      setCategory(productData.product.category);
      setStock(productData.product.countInStock);
      setPrice(productData.product.price);
      // setImage(productData.product.image.url);
      setImageUrl(productData.product.image.url);
      setQuantity(productData.product.quantity);
    }
  }, [productData]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      // console.log(image);
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("price", price);
      const updatedProduct = await updateProduct({
        productId: params._id,
        formData,
      });
      // console.log(updatedProduct);
      if (updatedProduct.error) {
        toast.error(updatedProduct.error.data.message);
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      toast.error("Product update failed, Try again");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure to delete this product");
      if (!answer) return;
      const deletedProduct = await deleteProduct(params._id);
      if (deleteProduct.error) {
        toast.error(deletedProduct.error.data.message);
      } else {
        toast.success("Product deleted successfully");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error("Product deletion failed, Try again.");
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="lg:mx-[6rem]  flex flex-col md:flex-row">
      <AdminMenu />
      <div className="p-4 grow">
        <div className="h-12 text-2xl font-semibold">update Product</div>
        {imageUrl && (
          <div className="text-center">
            <img
              src={imageUrl}
              alt="product"
              className="block mx-auto max-h-[70vh]"
            />
          </div>
        )}
        <div className="mb-3">
          <label
            htmlFor={!image ? "image" : ""}
            className="border border-gray-600 text-white px-4 block text-center mt-4 rounded-lg cursor-pointer font-bold py-12 bg-stone-800/40"
          >
            {imageUrl ? null : "Upload Image"}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              className={!imageUrl ? "hidden" : "text-white"}
              onChange={(e) => {
                setImageUrl(URL.createObjectURL(e.target.files[0]));
                setImage(e.target.files[0]);
              }}
            />
          </label>
        </div>

        <div className="p-3">
          <div className="flex flex-wrap">
            <div className="one w-full md:w-[48%]">
              <label htmlFor="name">Name</label> <br />
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="p-4 mb-3 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
            </div>
            <div className="two w-full md:w-[48%] md:ml-auto">
              <label htmlFor="price">Price</label> <br />
              <input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="p-4 mb-3 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
            </div>
            <div className="three w-full md:w-[48%]">
              <label htmlFor="quantity">Quantity</label> <br />
              <input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                className="p-4 mb-3 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
            </div>
            <div className="four w-full md:w-[48%] md:ml-auto">
              <label htmlFor="brand">Brand</label> <br />
              <input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                type="text"
                className="p-4 mb-3 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
              />
            </div>
            <label htmlFor="description" className="mt-5">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-4 mb-3 w-full bg-stone bg-stone-800/40 rounded-lg border text-white"
            ></textarea>
            <div className="flex justify-between w-full">
              <div className="w-[48%]">
                <label htmlFor="stock" className="block">
                  Count In Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  className="p-4 mb-3 border rounded-lg bg-stone-800/40 text-white w-full"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="w-[48%]">
                <label htmlFor="category">Category</label> <br />
                <select
                  name="category"
                  id="category"
                  defaultValue={"Choose Category"}
                  className="p-4 mb-3 border rounded-lg bg-stone-800/40 text-white w-full"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value={"Choose Category"} disabled hidden>
                    Choose Category
                  </option>
                  {categories &&
                    categories.map((c) => (
                      <option key={c._id} value={c._id} className="bg-sky-950">
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={handleSubmit}
                className="px-10 py-4 mt-5 rounded-lg text-lg font-blod max-md:w-full bg-green-600 mr-6 hover:bg-green-700 duration-[.3s] cursor-pointer"
              >
                Submit
              </button>
              <button
                onClick={handleDelete}
                className="px-10 py-4 mt-5 rounded-lg text-lg font-blod max-md:w-full bg-pink-600 hover:bg-pink-700 duration-[.3s] cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
