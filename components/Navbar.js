import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Image src="/icon.png" width={100} height={100} />
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
            <a>Inventory</a>
          </Link>
        </li>
        <li>
          <Link href="/main/product">
            <a>Products</a>
          </Link>
        </li>
        <li>
          <Link href="/main/cash">
            <a>Cash Portal</a>
          </Link>
        </li>
        <li>
          <Link href="/main/invoice">
            <a>Invoices</a>
          </Link>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
