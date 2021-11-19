import { useState, useEffect } from "react";
import { useAuthData } from "../Contexts/RoleContext";
import axios from "axios";

const useInventory = async (data) => {
  return {
    auth,
    setAuth,
  };
};

export default useInventory;
