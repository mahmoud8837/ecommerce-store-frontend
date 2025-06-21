import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
        method: "GET",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 5,
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "DELETE",
      }),
    }),
    getUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data?.updatedUser?.userId || data.userId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    addFavouriteProduct: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/favourites/add/${productId}`,
        method: "POST",
        body: productId,
      }),
    }),
    removeFavouriteProduct: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/favourites/remove/${productId}`,
        method: "DELETE",
        body: productId,
      }),
    }),
    getFavouriteProducts: builder.query({
      query: () => `${USERS_URL}/favourites`,
    }),
    getCart: builder.query({
      query: () => `${USERS_URL}/cart`,
    }),
    addToCart: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `${USERS_URL}/cart/add/${productId}`,
        method: "POST",
        body: { qty },
      }),
    }),
    deleteFromCart: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/cart/delete/${productId}`,
        method: "DELETE",
      }),
    }),
    updateAmountInCart: builder.mutation({
      query: ({ productId, qty }) => ({
        url: `${USERS_URL}/cart/update/${productId}`,
        method: "PUT",
        body: { qty },
      }),
    }),
    clearCartItems: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/cart/clear`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetUserDetailsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetFavouriteProductsQuery,
  useAddFavouriteProductMutation,
  useRemoveFavouriteProductMutation,
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useUpdateAmountInCartMutation,
  useGetCartQuery,
  useClearCartItemsMutation,
} = userApiSlice;
