import { useState } from "react";
import "./signup.scss";
import SignupImg from "../../assets/buildings-img.jpeg";
import WhiteLogo from "../../assets/icon-white.png";
import SignupForm from "../../components/signupform";
import LoginForm from "../../components/loginform";

export default function Signup() {
  const [currentForm, setCurrentForm] = useState("signupForm");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
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
          {currentForm === "signupForm" ? (
            <SignupForm onFormSwitch={toggleForm} />
          ) : (
            <LoginForm onFormSwitch={toggleForm} />
          )}
        </div>
      </section>
    </main>
  );
}
