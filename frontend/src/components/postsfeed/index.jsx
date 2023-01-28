import { useRef, useState, useEffect } from "react";
import useAxiosFetchFunction from "../../hooks/useAxiosFetchFunction";
import CreatePostForm from "../createpostForm";
import Post from "../Post";
import "./postsfeed.scss";
import { getAllPosts } from "../../api/calls/postcalls";

function PostsFeed() {
  const [posts, setPosts] = useState(undefined); // []
  const [page, setPage] = useState(1);
  const errRef = useRef();
  const effectRan = useRef(false);

  const [response, fetchError, loading, axiosFetch] = useAxiosFetchFunction();

  useEffect(() => {
    // if (effectRan.current === false) {
    if (effectRan.current === true) {
      getAllPosts(axiosFetch, page);
      // return () => {
      // effectRan.current = true;
      // };
    }
    return () => {
      effectRan.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); //  page

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (response) {
      if (!posts) {
        setPosts(response.items);
      } else {
        setPosts((prev) => [...prev, ...response.items]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]); // response

  useEffect(() => {
    const handleScroll = (e) => {
      if (
        window.innerHeight + e.target.documentElement.scrollTop + 300 >=
        e.target.documentElement.scrollHeight
      ) {
        if (page < response?.totalPages) {
          setPage(response.nextPage);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // clean up
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, page]);

  const handleCreate = (newPost) => {
    if (!posts) {
      setPosts([newPost]);
    } else {
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const handleDelete = (postId) => {
    if (posts.length === 1) {
      setPosts(undefined);
    } else {
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  const handleUpdate = (updatedPost, postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return updatedPost;
        }
        return post;
      })
    );
  };

  const handleClick = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <CreatePostForm onCreate={handleCreate} />
      <section className="postsFeedContainer">
        {loading && <p>Chargement en cours...</p>}
        {!loading && fetchError && (
          <p
            ref={errRef}
            className={fetchError ? "errMsg" : "offscreen"}
            aria-live="assertive"
          >
            {fetchError}
          </p>
        )}
        {!loading && !fetchError && !posts && <h1>No posts to dislay !</h1>}
        {!fetchError && !loading && posts?.length && (
          <>
            {posts.map((post) => (
              <Post
                post={post}
                key={post.id}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </>
        )}

        <button className="linkBtn" type="button" onClick={handleClick}>
          Haut de page
        </button>
      </section>
    </>
  );
}

export default PostsFeed;
