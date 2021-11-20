import { useState, useEffect } from "react";
import { useRole, useBusiness, useStorage, useSpace } from "../context/Context";
import axios from "axios";

const useCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [space, setSpace] = useSpace();
  const [storage, setStorage] = useStorage();
  const [display, setDisplay] = useState([]);
  const [businessId, setBusinessId] = useState();

  const checkStatus = async () => {
    const res = await axios.get("/api/inventory");
    const { items, businessId } = await res.data;
    console.log("response:");
    console.log(res);
    console.log(items);

    const id = businessId;

    await setSpace(items);
    setDisplay(items);
    setBusinessId(id);

    console.log("the inventory");
    console.log(space);
    setIsLoading(false);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return {
    isLoading,
    space,
    storage,
    setStorage,
    display,
    setDisplay,
    businessId,
  };
};

export default useCheck;
