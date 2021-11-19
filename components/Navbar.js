import Link from "next/link";
import Image from "next/Image";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Image src="/Bakso.svg" width={77} height={102} />
        <h1>CoolCompany</h1>
      </div>
      <div className="links">
        <li>
          <Link href="/">
            <a>Landing</a>
          </Link>
        </li>
        <li>
          <Link href="/auth">
            <a>Auth</a>
          </Link>
        </li>
        {/* <li>
          <Link href="/auth/signup">
            <a>Sign Up</a>
          </Link>
        </li>
        <li>
          <Link href="/auth/login">
            <a>Login</a>
          </Link>
        </li> */}
        <li>
          <Link href="/settings">
            <a>Settings</a>
          </Link>
        </li>
        <li>
          <Link href="/main">
            <a>Main</a>
          </Link>
        </li>
        <li>
          <Link href="/main/inventory">
            <a>ICS</a>
          </Link>
        </li>
        <li>
          <Link href="/main/products">
            <a>Products</a>
          </Link>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
