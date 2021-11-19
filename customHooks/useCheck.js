import { useState, useEffect } from "react";
import { useRole, useBusiness, useStorage } from "../Contexts/RoleContext";
import axios from "axios";

const useCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useRole();
  const [business, setBusiness] = useBusiness();
  const [storage, setStorage] = useStorage();
  const [msg, setMsg] = useState(null);

  const checkStatus = async () => {
    const res = await axios.get("/api/status");
    const { currentRole, businessInfo, note } = res.data;
    setRole(currentRole);
    setBusiness(businessInfo);
    setIsLoading(false);

    console.log("The business: ");
    console.log(business);

    console.log("Msg:");
    console.log(note);
    setMsg(note);
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
    msg,
    storage,
    setStorage,
  };
};

export default useCheck;
