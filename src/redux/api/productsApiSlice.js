import { apiSlice } from "./apiSlice";
import { PRODUCT_URL } from "../constants";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `${PRODUCT_URL}`,
        params: { page, limit },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (res, error, productId) => [
        { type: "Product", id: productId },
      ],
    }),
    allProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `${PRODUCT_URL}/allproducts`,
        params: { page, limit },
      }),
    }),
    getProductDetails: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({productId, formData}) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      providesTags: ["Product"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}/reviews`,
        method: "DELETE"
      })
    }),
    getReviewedProducts: builder.query({
      query: () => `${PRODUCT_URL}/reviews`
    }),
    getTopProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `${PRODUCT_URL}/top`,
        method: "GET",
        params: { page, limit },
      }),
      keepUnusedDataFor: 5,
    }),
    getNewProducts: builder.query({
      query: ({ page, limit }) => ({
        url: `${PRODUCT_URL}/new`,
        method: "GET",
        params: { page, limit },
      }),
      keepUnusedDataFor: 5
    }),
    getFilteredProducts: builder.query({
      query: ({checked, fromPrice, toPrice}) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: {checked, fromPrice, toPrice}
      })
    })
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductDetailsQuery,
  useGetNewProductsQuery,
  useGetTopProductsQuery,
  useAllProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetReviewedProductsQuery,
  useGetFilteredProductsQuery
} = productsApiSlice;
