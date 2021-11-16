import { createContext, useContext, useState } from "react";
const User = require("../models/User");

export const RoleContext = createContext();
export const RoleUpdateContext = createContext();

// custom hooks
export const useRole = () => {
  return useContext(RoleContext);
};
export const useRoleUpdate = () => {
  return useContext(RoleUpdateContext);
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("employee");

  const updateRole = (userId) => {
    const user = await User.findOne({ _id: userId });
    if (user.role === "owner") {
      setRole(owner);
    }
    return;
  };

  return (
    <RoleContext.Provider value={[role, setRole]}>
      <RoleUpdateContext.Provider value={updateRole}>
        {children}
      </RoleUpdateContext.Provider>
    </RoleContext.Provider>
  );
};
