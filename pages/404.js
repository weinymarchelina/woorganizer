import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
const NotFound = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);

  return (
    <div className="body">
      <h1>Page not found!</h1>
      <p>
        Going back to
        <Link href="/">
          <a> main page </a>
        </Link>
        in 3 seconds...
      </p>
    </div>
  );
};

export default NotFound;
