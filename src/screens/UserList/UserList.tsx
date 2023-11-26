import { ListItem, CheckBox } from "@rneui/themed";
import React, { useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";

import {
  useGetUsersQuery,
  useDeleteUserAndPostsMutation,
  //   useDeleteUserMutation,
} from "../../store/api/usersApi";

const UserList = ({ navigation }) => {
  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useGetUsersQuery({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteUserAndPosts] = useDeleteUserAndPostsMutation();
  //   const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      for (const userId of selectedUsers) {
        await deleteUserAndPosts(userId);
      }
      refetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error deleting selected users and posts:", error);
      Alert.alert(
        "Error",
        "Could not delete selected users and posts. Please try again.",
      );
    }
  };
  const sortedUsers = users?.slice().sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          <FlatList
            data={sortedUsers}
            renderItem={({ item }) => (
              <ListItem>
                <CheckBox
                  checked={selectedUsers.includes(item.id)}
                  onPress={() => {
                    setSelectedUsers((prev) =>
                      prev.includes(item.id)
                        ? prev.filter(
                            (selectedUserId) => selectedUserId !== item.id,
                          )
                        : [...prev, item.id],
                    );
                  }}
                />
                <ListItem.Content
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>{`${item.firstName} ${item.lastName}`}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      title="Info"
                      onPress={() =>
                        navigation.navigate("UserInfo", {
                          user: item,
                        })
                      }
                    />
                    <Button
                      title="Edit"
                      onPress={() =>
                        navigation.navigate("UserForm", {
                          user: item,
                        })
                      }
                    />
                    {/* <Button
                      title="Radera"
                      onPress={() => deleteUser(item.id)}
                    /> */}
                  </View>
                </ListItem.Content>
              </ListItem>
            )}
          />
          {selectedUsers.length > 0 && (
            <Button title="Delete" onPress={handleDelete} />
          )}
        </View>
      )}
    </View>
  );
};

export default UserList;
