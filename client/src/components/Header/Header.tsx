import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Horizontal Blue Logo Transparent.png";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="PJMF Logo" className="logo" />
        </Link>
        <Link to="/data" className="nav-link">
          Data
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
      </div>
    </header>
  );
};
