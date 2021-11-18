import { useState, useEffect } from "react";
import { useRole, useBusiness } from "../Contexts/RoleContext";
import axios from "axios";

const useCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useRole();
  const [business, setBusiness] = useBusiness();

  const checkStatus = async () => {
    const res = await axios.get("/api/status");
    const { currentRole, businessInfo } = res.data;
    setRole(currentRole);
    setBusiness(businessInfo);
    setIsLoading(false);

    console.log("The business: ");
    console.log(business);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return {
    isLoading,
    role,
    setRole,
    business,
    setBusiness,
  };
};

export default useCheck;
