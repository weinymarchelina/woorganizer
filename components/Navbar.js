import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Image src="/logo.png" width={75} height={75} />
      </div>
      <div className="links">
        <li>
          <Link href="/">
            <a>Dashboard</a>
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
          <Link href="/main/invoice">
            <a>Invoices</a>
          </Link>
        </li>
        <li>
          <Link href="/settings">
            <a>Settings</a>
          </Link>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
