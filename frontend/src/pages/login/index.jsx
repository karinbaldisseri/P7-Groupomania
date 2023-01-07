import { useState } from "react";
import "../signup/signup.scss";
import LoginImg from "../../assets/buildings-img.jpeg";
import WhiteLogo from "../../assets/icon-white.png";
import SignupForm from "../../components/signupform";
import LoginForm from "../../components/loginform";

export default function Login() {
  const [currentForm, setCurrentForm] = useState("loginForm");

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  };

  return (
    <main className="connectPage">
      <section className="connectMainSection">
        <div className="imgSection">
          <img
            src={LoginImg}
            className="connectImg"
            alt="paysage d'immeubles"
          />
          <div className="imgText">
            <img src={WhiteLogo} className="logo" alt="Logo de Groupomania" />
            <h1>Bienvenue sur votre réseau social d'entreprise</h1>
          </div>
        </div>
        <div className="formCard">
          {currentForm === "loginForm" ? (
            <LoginForm onFormSwitch={toggleForm} />
          ) : (
            <SignupForm onFormSwitch={toggleForm} />
          )}
        </div>
      </section>
    </main>
  );
}
