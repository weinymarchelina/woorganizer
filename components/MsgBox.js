import useCheck from "../customHooks/useCheck";
import { useState } from "react";

const MsgBox = () => {
  const { msg } = useCheck();
  const [click, setClick] = useState(false);
  return (
    <div>
      <button onClick={() => (click ? setClick(false) : setClick(true))}>
        Message
      </button>

      {click && !msg && <p>No new msg yet</p>}
      {click && msg && (
        <>
          <p>{msg.createdAt}</p>
          <p>{msg.msg}</p>
        </>
      )}
    </div>
  );
};

export default MsgBox;
