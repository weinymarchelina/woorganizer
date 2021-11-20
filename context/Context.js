import { createContext, useContext, useState } from "react";
export const RoleContext = createContext();
export const BusinessContext = createContext();
export const StorageContext = createContext();
export const SpaceContext = createContext();

export const useRole = () => {
  return useContext(RoleContext);
};
export const useBusiness = () => {
  return useContext(BusinessContext);
};
export const useStorage = () => {
  return useContext(StorageContext);
};
export const useSpace = () => {
  return useContext(SpaceContext);
};

export const GlobalProvider = ({ children }) => {
  const [role, setRole] = useState("Employee");
  const [business, setBusiness] = useState(null);
  const [storage, setStorage] = useState([]);
  const [space, setSpace] = useState([]);

  return (
    <RoleContext.Provider value={[role, setRole]}>
      <BusinessContext.Provider value={[business, setBusiness]}>
        <StorageContext.Provider value={[storage, setStorage]}>
          <SpaceContext.Provider value={[space, setSpace]}>
            {children}
          </SpaceContext.Provider>
        </StorageContext.Provider>
      </BusinessContext.Provider>
    </RoleContext.Provider>
  );
};
