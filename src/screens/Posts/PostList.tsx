import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { Table, Row } from "react-native-table-component";

import {
  useGetPostsQuery,
  useDeletePostMutation,
} from "../../store/api/postsApi";
import { useGetUsersQuery } from "../../store/api/usersApi";

const PostList = () => {
  const {
    data: posts,
    isLoading: postsLoading,
    refetch,
  } = useGetPostsQuery({});
  const { data: users, isLoading: usersLoading } = useGetUsersQuery({});
  const [deletePost] = useDeletePostMutation();

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      // Uppdatera listan efter att posten har raderats
      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Could not delete post. Please try again.");
    }
  };

  const handleRefresh = () => {
    // Manuellt refetcha datan när användaren trycker på refresh-knappen
    refetch();
  };

  if (postsLoading || usersLoading) {
    return <Text>Loading...</Text>;
  }

  const getUserNameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const tableHead = ["Post", "User", "Date", "Action"];

  return (
    <View>
      <TouchableOpacity onPress={handleRefresh}>
        <Text style={{ textAlign: "center", padding: 10, color: "blue" }}>
          Refresh
        </Text>
      </TouchableOpacity>
      <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
        <Row
          data={tableHead}
          style={{ height: 40, backgroundColor: "#f1f8ff" }}
          textStyle={{ margin: 6 }}
        />
      </Table>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            <Row
              data={[
                `${item.text}`,
                `${getUserNameById(item.createdBy)}`,
                `${item.createdDate}`,
                <Button
                  title="Radera"
                  onPress={() => handleDeletePost(item.id)}
                />,
              ]}
              textStyle={{ margin: 6 }}
            />
          </Table>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default PostList;
