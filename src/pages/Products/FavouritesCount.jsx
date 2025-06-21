import { useEffect, useState } from "react";
import { useGetFavouriteProductsQuery } from "../../redux/api/usersApiSlice";

const FavouritesCount = () => {
  const { data } = useGetFavouriteProductsQuery();
  const [favouritesCount, setFavouritesCount] = useState(
    data?.products?.length || 0
  );
  useEffect(() => {
    setFavouritesCount(data?.products?.length);
  }, [data]);

  return (
    <div className="absolute left-8 top-2 lg:left-4 lg:top-10 xl:left-5 xl:top-9">
      {favouritesCount > 0 && (
        <span className="flex justify-center p-2 items-center text-sm text-white bg-pink-500 w-4 h-4 rounded-full">
          {favouritesCount}
        </span>
      )}
    </div>
  );
};

export default FavouritesCount;
