import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET": {
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { data };
    }

    case "POST": {
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };
    }

    case "DELETE": {
      const docDelRef = await deleteDoc(doc(db, url, body));
      return { data: { id: docDelRef } };
    }

    case "PUT":
      await updateDoc(doc(db, url, body.id), body);
      return { data: { ...body } };

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["posts"],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ user, isPrivate }) => ({
        baseUrl: "",
        url: "posts",
        method: "POST",
        body: { ...user, private: isPrivate },
      }),
      invalidatesTags: ["posts"],
    }),
    getPosts: builder.query({
      query: ({ user, isPrivate }) => ({
        baseUrl: "",
        url: "posts",
        method: "GET",
        body: { ...user, private: isPrivate },
      }),
      providesTags: ["posts"],
    }),

    updatePost: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: `posts/${user.id}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["posts"],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: `posts/${id}`,
        method: "DELETE",
        body: "",
      }),
      invalidatesTags: ["posts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postsApi;
