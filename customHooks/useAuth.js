import { useState, useEffect } from "react";
import { useAuthData } from "../Contexts/RoleContext";
import axios from "axios";

const useAuth = async (data) => {
  const [auth, setAuth] = await useAuthData("test");

  if (data) {
    console.log(data);
  }

  useEffect(() => {
    if (data) {
      setAuth(data);
    }
  }, []);

  return {
    auth,
    setAuth,
  };
};

export default useAuth;
