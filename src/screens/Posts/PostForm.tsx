import { useNavigation } from "@react-navigation/native";
import { CheckBox } from "@rneui/base";
import React, { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

import { useCreatePostMutation } from "../../store/api/postsApi";

const PostForm = () => {
  const [postText, setPostText] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const [createPost] = useCreatePostMutation();
  const navigation = useNavigation();
  const toast = useToast();

  const handleCreatePost = async () => {
    if (!loggedInAs) {
      toast.show("You must be logged in to create a post!", {
        type: "fail",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }

    const createdDate = new Date().toLocaleDateString();

    try {
      await createPost({
        user: {
          text: postText,
          createdBy: loggedInAs.id,
          createdDate,
        },
        isPrivate, //isPrivate state skickas
      });

      toast.show("Post created successfully!", {
        type: "success",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      setPostText("");
      // navigera till UserIno efter created
      (navigation as any).navigate("UserInfo");
    } catch (error) {
      console.error("Error creating post:", error);
      // Show any error message
      Alert.alert("Error", "Could not create post. Please try again.");
    }
  };

  const handleCancel = () => {
    // navigera till UserList när man trycker på cancel
    (navigation as any).navigate("UserListStack");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter post text"
        value={postText}
        onChangeText={(text) => setPostText(text)}
      />
      <CheckBox
        title="Private Post"
        checked={isPrivate}
        onPress={() => setIsPrivate((prev) => !prev)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Create post" onPress={handleCreatePost} />
        <Button title="Cancel" onPress={handleCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PostForm;
