import { createContext, useContext, useState } from "react";
export const RoleContext = createContext();
export const BusinessContext = createContext();
export const AuthContext = createContext();

// custom hooks
export const useRole = () => {
  return useContext(RoleContext);
};
export const useBusiness = () => {
  return useContext(BusinessContext);
};
export const useAuthData = () => {
  return useContext(AuthContext);
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("Employee");
  const [business, setBusiness] = useState(null);
  const [auth, setAuth] = useState();

  // const updateRole = async () => {
  //   console.log("Hello");
  // };

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      <RoleContext.Provider value={[role, setRole]}>
        <BusinessContext.Provider value={[business, setBusiness]}>
          {children}
        </BusinessContext.Provider>
      </RoleContext.Provider>
    </AuthContext.Provider>
  );
};
