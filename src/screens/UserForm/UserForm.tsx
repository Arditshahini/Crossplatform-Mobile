import { Input, Button } from "@rneui/themed";
import { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  //   TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../store/api/usersApi";

export const UserForm = (props) => {
  const { route, navigation } = props;
  const lastNameRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const toast = useToast();

  const isEditing = !!route?.params?.user;

  useEffect(() => {
    if (isEditing) {
      // Om man ändrar så ska User data fyllas i automatisk i UserForm. knappen omvandlas till "Update user"
      const { user } = route.params;
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }
  }, [isEditing, route.params]);

  const handleSubmit = () => {
    if (firstName === "" || lastName === "") {
      toast.show("Please fill out all inputs", {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
      });
      return;
    }

    //Titta varför man var tvungen att lägga types här V
    //Den reagerar på .id

    // const user = {
    //     firstName: firstName,
    //     lastName: lastName
    // }

    const user: { id?: number; firstName: string; lastName: string } = {
      firstName,
      lastName,
    };

    if (isEditing) {
      // If editing, update the existing user
      user.id = route.params.user.id;
      updateUser({ user })
        .then(() => {
          navigation.navigate("UserList");
          toast.show(`User ${firstName} ${lastName} updated!`, {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
        })
        .catch((error) => {
          toast.show(error, { type: "danger" });
        });
    } else {
      // If creating, create a new user
      createUser({ user })
        .then(() => {
          navigation.navigate("UserList");
          toast.show(`User ${firstName} ${lastName} created!`, {
            type: "success",
            placement: "top",
            duration: 2000,
            animationType: "slide-in",
          });
          setFirstName("");
          setLastName("");
        })
        .catch((error) => {
          toast.show(error, { type: "danger" });
        });
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        <Text>{isEditing ? "Edit user" : "Create your user"}</Text>
        <Input
          returnKeyType="next"
          onSubmitEditing={() => lastNameRef.current.focus()}
          blurOnSubmit={false}
          value={firstName}
          disabled={isCreating || isUpdating}
          onChangeText={(text) => setFirstName(text)}
          placeholder="First name"
        />
        <Input
          ref={lastNameRef}
          value={lastName}
          disabled={isCreating || isUpdating}
          returnKeyType="send"
          onSubmitEditing={() => handleSubmit()}
          onChangeText={(text) => setLastName(text)}
          placeholder="Last name"
        />
        <Button
          title={isEditing ? "Update user" : "Create user"}
          disabled={isCreating || isUpdating}
          loading={isCreating || isUpdating}
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit();
          }}
        />
      </View>
    </View>
    // </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: "white",
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
});
