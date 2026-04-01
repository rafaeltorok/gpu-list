import { Link } from "react-router-dom";
import "../../styles/Header.css";

function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="header-logo">
        <h1>GPU LIST</h1>
      </Link>
    </header>
  );
}

export default Header;
