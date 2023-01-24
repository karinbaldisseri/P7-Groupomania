import Header from "../../components/header";
import PostsFeed from "../../components/postsfeed";
import "./postswall.scss";

export default function Postswall() {
  return (
    <>
      <Header />
      <main className="postswallPage">
        <div className="postswallContainer">
          <h1>Fil d'actualités</h1>
          <PostsFeed />
        </div>
      </main>
    </>
  );
}
