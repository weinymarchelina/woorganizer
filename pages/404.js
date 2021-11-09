import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/dist/client/router";

const NotFound = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 7500);
  }, []);

  return (
    <div>
      <h1>Page not found</h1>
      <p>
        Return to landing page
        <Link href="/">
          <a> here </a>
        </Link>
        or in a few seconds...
      </p>
    </div>
  );
};

export default NotFound;
