import { NavLink } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle, FaNewspaper } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import RedLogo from "../../assets/icon-red.png";
import useWindowSize from "../../hooks/useWindowSize";
import "./header.scss";

export default function Header() {
  const { setAuth } = useAuth();
  const { width } = useWindowSize();

  const handleLogout = () => {
    setAuth("");
    window.location = "/"; // replace navigate dont use window.location
  };

  return (
    <header>
      <NavLink onClick={handleLogout}>
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
              {width > 768 ? (
                "Fil d'actualités"
              ) : (
                <FaNewspaper title="Fil d'actualités" />
              )}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => {
                return isActive ? "activeLink" : "";
              }}
            >
              {width > 768 ? "Mon profil" : <FaUserCircle title="Mon profil" />}
            </NavLink>
          </li>
          <li>
            <FaSignOutAlt onClick={handleLogout} title="Me déconnecter" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
