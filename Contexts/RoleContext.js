import { createContext, useContext, useState } from "react";
export const RoleContext = createContext();
export const BusinessContext = createContext();
export const StorageContext = createContext();

// custom hooks
export const useRole = () => {
  return useContext(RoleContext);
};
export const useBusiness = () => {
  return useContext(BusinessContext);
};
export const useStorage = () => {
  return useContext(StorageContext);
};

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("Employee");
  const [business, setBusiness] = useState(null);
  const [storage, setStorage] = useState([]);

  // const updateRole = async () => {
  //   console.log("Hello");
  // };

  return (
    <StorageContext.Provider value={[storage, setStorage]}>
      <RoleContext.Provider value={[role, setRole]}>
        <BusinessContext.Provider value={[business, setBusiness]}>
          {children}
        </BusinessContext.Provider>
      </RoleContext.Provider>
    </StorageContext.Provider>
  );
};
