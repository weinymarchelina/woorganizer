import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/main");
    }, 3000);
  }, []);

  return (
    <div className="not-found">
      <h1>Page not found!</h1>
      <p>Did you put the wrong URL or something? </p>
      <p>
        Going back to
        <Link href="/">
          <a> homepage </a>
        </Link>
        on 3 seconds...
      </p>
    </div>
  );
};

export default NotFound;
