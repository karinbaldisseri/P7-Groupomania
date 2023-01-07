import { FaUserCircle } from "react-icons/fa";
import Header from "../../components/header";
import ProfileForm from "../../components/profileform";
import "./profile.scss";

export default function Profile() {
  return (
    <>
      <Header />
      <main className="profilePage">
        <section className="profileContainer">
          <h1>Mon Profil</h1>
          <FaUserCircle fill="grey" className="userIcon" />
          <ProfileForm />
        </section>
      </main>
    </>
  );
}
