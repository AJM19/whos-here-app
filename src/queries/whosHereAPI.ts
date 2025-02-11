import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Square = {
  id: number;
  value: boolean;
};

export const whosHereAPI = createApi({
  reducerPath: "whosHereAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://whos-here-api-production.up.railway.app",
  }),
  tagTypes: ["Square"],
  endpoints: (builder) => ({
    getSquares: builder.query<Square[], void>({
      query: () => ({
        url: `/squares`,
        method: "GET",
      }),
      transformResponse: (response: { data: Square[] }) => {
        return response.data;
      },
    }),
    updateSquare: builder.mutation<void, Square>({
      query: ({ id, value }) => ({
        url: `/update-square`,
        method: "POST",
        body: {
          id,
          value,
        },
      }),
    }),
  }),
});

export const { useGetSquaresQuery, useUpdateSquareMutation } = whosHereAPI;
