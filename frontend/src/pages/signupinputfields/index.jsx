import { NavLink } from "react-router-dom";
import SignupImg from "../../assets/buildings-img.jpeg";
import WhiteLogo from "../../assets/icon-white.png";
import SignupFormInputFields from "../../components/signupforminputfields";
import "../signup/signup.scss";

export default function SignupInputFields() {
  return (
    <>
      <NavLink to="/signup" className="temporary">
        GO TO Signup without Input fields
      </NavLink>
      <main className="connectPage">
        <section className="connectMainSection">
          <div className="imgSection">
            <img
              src={SignupImg}
              className="connectImg"
              alt="paysage d'immeubles"
              loading="lazy"
            />
            <div className="imgText">
              <img
                src={WhiteLogo}
                className="logo"
                alt="Logo de Groupomania"
                loading="lazy"
              />
              <h1>Bienvenue sur votre réseau social d'entreprise</h1>
            </div>
          </div>
          <div className="formCard">
            <SignupFormInputFields />
          </div>
        </section>
      </main>
    </>
  );
}
