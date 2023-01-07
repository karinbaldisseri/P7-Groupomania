import { NavLink } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import RedLogo from "../../assets/icon-red.png";
import "./header.scss";

export default function Header() {
  const { setAuth } = useAuth();

  const handleLogout = () => {
    setAuth("");
    window.location = "/login";
  };

  return (
    <header>
      <NavLink to="/">
        <img
          src={RedLogo}
          alt="Logo de Groupomania"
          title="Aller à la page d'accueil / de connexion"
          loading="lazy"
        />
      </NavLink>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/postswall"
              className={({ isActive }) => {
                return isActive ? "activeLink" : "";
              }}
            >
              Fil d'actualités
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => {
                return isActive ? "activeLink" : "";
              }}
            >
              Mon profil
            </NavLink>
          </li>
          <li>
            <FaSignOutAlt onClick={handleLogout} title="Logout" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
