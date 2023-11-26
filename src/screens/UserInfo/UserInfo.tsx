import { Button } from "@rneui/themed";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Table, Row } from "react-native-table-component";
import { useDispatch, useSelector } from "react-redux";

import { useGetPostsQuery } from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";
import { logIn, logOut } from "../../store/slices/authSlice";

export const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();
  const { data: users } = useGetUsersQuery({});
  const { data: userPosts, isLoading } = useGetPostsQuery({
    baseUrl: "",
    url: "posts",
    method: "GET",
    body: "",
    createdBy: user.id,
  });
  const getUserNameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const isOwnProfile = loggedInAs && loggedInAs.id === user.id;

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }} />
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row
          data={[
            isOwnProfile ? (
              <Button
                onPress={() => dispatch(logOut())}
                title="Logga ut"
                color="error"
              />
            ) : (
              <Button onPress={() => dispatch(logIn(user))} title="Logga in" />
            ),
          ]}
          textStyle={{ margin: 6 }}
        />
      </Table>
      {/* Display all posts for the current user if it's their own profile */}
      {isOwnProfile && (
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={["Posts:"]}
            style={{ height: 40, backgroundColor: "#f1f8ff" }}
            textStyle={{ margin: 6 }}
          />
          {isLoading ? (
            <Row data={["Loading posts..."]} textStyle={{ margin: 6 }} />
          ) : (
            userPosts.map((item) => (
              <Row
                key={item.id.toString()}
                data={[
                  `Created by: ${getUserNameById(item.createdBy)}`,
                  `Post: ${item.text}`,
                  `Created on: ${item.createdDate}`,
                ]}
                textStyle={{ margin: 6 }}
              />
            ))
          )}
        </Table>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: "auto",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36,
  },
});
