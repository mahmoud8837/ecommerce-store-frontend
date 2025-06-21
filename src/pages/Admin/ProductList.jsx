import { useCreateProductMutation } from "../../redux/api/productsApiSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState("");
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("price", price);
      const product = await createProduct(productData).unwrap();
      toast.success(`${product.data.name} is created successfully`);
      navigate("/admin/allproductslist");
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  return (
    <div className="lg:mx-[6rem]  flex flex-col md:flex-row">
      <AdminMenu />
      <div className="p-4 grow">
        <div className="h-12 text-2xl font-semibold">Create Product</div>
        {imageUrl && (
          <div className="text-center">
            <img
              src={imageUrl}
              alt="product"
              className="block mx-auto max-h-[200px]"
            />
          </div>
        )}
        <div className="mb-3">
          <label
            htmlFor={!image ? "image" : ""}
            className="border text-white px-4 block text-center rounded-lg cursor-pointer font-bold py-12 bg-stone-800/40"
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
              className="p-4 mb-3 w-full bg-stone-800/40 rounded-lg border text-white"
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
            <button
              onClick={handleSubmit}
              className="px-10 py-4 mt-5 rounded-lg text-lg font-blod max-md:w-full bg-pink-600 hover:bg-pink-700 duration-[.3s] cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
