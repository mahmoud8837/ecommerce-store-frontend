import { useState } from "react";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApiSlice";
import CategoryForm from "../../components/CategoryForm";
import { toast } from "react-toastify";
import Model from "../../components/Model";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modelVisible, setModelVisible] = useState(null);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await createCategory({ name }).unwrap();
      if (res.error) {
        toast.error(res.error);
      } else {
        setName("");
        toast.success(`${res.name} is created.`);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.data.message);
      toast.error("Creating category failed, try again");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (res.error) {
        return toast.error(res.error);
      } else {
        toast.success(`Old name is: ${res.oldCategoryName}`);
        toast.success(`New name is: ${res.newCategoryName}`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModelVisible(false);
        refetch();
      }
    } catch (error) {
      toast.error("Updating category failed, try again.");
      toast.error(error.data.message);
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const res = await deleteCategory(selectedCategory._id).unwrap();
      if (res.error) {
        return toast.error(res.data.message);
      } else {
        toast.success(`${selectedCategory.name} is deleted successfully`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModelVisible(false);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed, try again");
    }
  };

  if (isLoading) {
    return (
      <div className="lg:mx-[6rem] ">
        <div className="p-4">
          <div className="h-12 text-2xl font-semibold">Manage Categories</div>
          <Loader />
        </div>
      </div>
    );
  }

  if (categories) {
    return (
      <div className="lg:ml-[6rem] flex flex-col md:flex-row">
        <AdminMenu />
        <div className="p-4">
          <div className="h-12 text-2xl font-semibold">Manage Categories</div>
          <CategoryForm
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            buttonText="Create"
          />
          <br />
          <hr />
          <div className="flex flex-wrap justify-center items-center">
            {categories?.map((category) => (
              <div key={category._id}>
                <button
                  onClick={() => {
                    setModelVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }}
                  className=" border text-pink-500 cursor-pointer duration-[.3s] border-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                >
                  {category.name}
                </button>
              </div>
            ))}
          </div>

          <Model isOpen={modelVisible} onClose={() => setModelVisible(false)}>
            <CategoryForm
              value={updatingName}
              setValue={(value) => setUpdatingName(value)}
              handleSubmit={handleUpdateCategory}
              buttonText="Update"
              handleDelete={handleDeleteCategory}
            />
          </Model>
        </div>
      </div>
    );
  }
};

export default CategoryList;
