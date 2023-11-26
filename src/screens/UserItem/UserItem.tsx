// UserItem.tsx
import { ListItem, CheckBox } from "@rneui/base";
import React, { useState } from "react";

const UserItem = ({ user, onToggle }) => {
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
    onToggle(user.id);
  };

  return (
    <ListItem>
      <CheckBox checked={checked} onPress={handleToggle} />
    </ListItem>
  );
};

export default UserItem;
