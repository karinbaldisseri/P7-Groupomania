import LoginImg from "../../assets/buildings-img.jpeg";
import WhiteLogo from "../../assets/icon-white.png";
import LoginForm from "../../components/loginform";
import "../signup/signup.scss";

export default function Login() {
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
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
