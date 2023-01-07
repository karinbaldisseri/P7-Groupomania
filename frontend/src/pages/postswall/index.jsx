import CreatePost from "../../components/createpost";
import Header from "../../components/header";
import "./postswall.scss";

export default function Postswall() {
  return (
    <>
      <Header />
      <main className="postswallPage">
        <section className="postswallContainer">
          <h1>Fil d'actualités</h1>
          <CreatePost />
        </section>
      </main>
    </>
  );
}
