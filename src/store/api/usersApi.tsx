import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "DELETE_USER_AND_POSTS": {
      const userDocRef = doc(db, "users", body);
      const postsQuerySnapshot = await getDocs(
        query(collection(db, "posts"), where("createdBy", "==", body)),
      );

      // Ta bort användaren
      await deleteDoc(userDocRef);

      // Ta bort användarens poster
      const deletePostPromises = postsQuerySnapshot.docs.map(
        async (postDoc) => {
          await deleteDoc(postDoc.ref);
        },
      );
      await Promise.all(deletePostPromises);

      return { data: { id: body } };
    }
    case "DELETE": {
      const docDelRef = await deleteDoc(doc(db, url, body));

      return { data: { id: docDelRef } };
    }

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

    case "PUT": {
      await updateDoc(doc(db, url, body.id), body);
      return { data: { ...body } };
    }
    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["users"],
  endpoints: (builder) => ({
    // För att skapa en ny user. Anropas såhär createUser({ user: { firstName: firstName, lastName: lastName }})
    createUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    // För att hämta alla befintliga users
    getUsers: builder.query({
      query: () => ({
        baseUrl: "",
        url: "users",
        method: "GET",
        body: "",
      }),
      providesTags: ["users"],
    }),

    // För att uppdatera en user. Anropas såhär updateUser({ user: { id: user.id, firstName: firstName, lastName: lastName }})
    updateUser: builder.mutation({
      query: ({ user }) => ({
        baseUrl: "",
        url: "users",
        method: "PUT",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    // För att radera en user baserat på id. Anropas såhär: deleteUser(id)
    deleteUser: builder.mutation({
      query: (id) => ({
        baseUrl: "",
        url: "users",
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUserAndPosts: builder.mutation({
      query: (userId) => ({
        baseUrl: "",
        url: "users",
        method: "DELETE_USER_AND_POSTS",
        body: userId,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

// Exportera våra Queries och Mutations här.
export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useDeleteUserAndPostsMutation,
  useUpdateUserMutation,
} = usersApi;
