import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import PostForm from "./src/screens/Posts/PostForm";
import PostList from "./src/screens/Posts/PostList";
import { UserForm } from "./src/screens/UserForm/UserForm";
import { UserInfo } from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/UserList";
import { persistor, store } from "./src/store/store";

const UserListStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserForm" component={UserForm} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
    </UserListStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Create User" component={UserForm} />
        <Tab.Screen
          name="UserListStack"
          component={UserListStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="PostList" component={PostList} />
        <Tab.Screen name="PostForm" component={PostForm} />

        {loggedInAs && (
          <Tab.Screen
            name="UserInfo"
            component={UserInfo}
            options={{
              title: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationWrapper />
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
