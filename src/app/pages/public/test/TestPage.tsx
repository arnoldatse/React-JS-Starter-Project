import { FC, useState } from "react";

const TestPage: FC = () => {
  const [likesState, setLikesState] = useState({
    likes: 100,
    liked: false,
  });

  const [dislikesState, setDislikesState] = useState({
    dislikes: 25,
    disliked: false,
  });

  const like = () => {
    //if disliked
    if (dislikesState.disliked) {
      undislike();
    }

    setLikesState((oldLikesState) => ({
      likes: oldLikesState.likes + 1,
      liked: true,
    }));
  };

  const unlike = () => {
    setLikesState((oldLikesState) => ({
      likes: oldLikesState.likes - 1,
      liked: false,
    }));
  };

  const dislike = () => {
    //if liked
    if (likesState.liked) {
      unlike();
    }

    setDislikesState((oldDislikesState) => ({
      dislikes: oldDislikesState.dislikes + 1,
      disliked: true,
    }));
  };

  const undislike = () => {
    setDislikesState((oldDislikesState) => ({
      dislikes: oldDislikesState.dislikes - 1,
      disliked: false,
    }));
  };

  const handleLikeClick = () => {
    if (likesState.liked) {
      unlike();
    } else {
      like();
    }
  };

  const handleDislikeClick = () => {
    if (dislikesState.disliked) {
      undislike();
    } else {
      dislike();
    }
  };

  return (
    <>
      <div>
        <button
          className={`like-button${likesState.liked ? " liked" : ""}`}
          onClick={handleLikeClick}
        >
          Like | <span className="likes-counter">{likesState.likes}</span>
        </button>
        <button
          className={`dislike-button${
            dislikesState.disliked ? " disliked" : ""
          }`}
          onClick={handleDislikeClick}
        >
          Dislike |{" "}
          <span className="dislikes-counter">{dislikesState.dislikes}</span>
        </button>
      </div>
      <style>{`
                        .like-button, .dislike-button {
                            font-size: 1rem;
                            padding: 5px 10px;
                            color:   #585858;
                        }
    
                        .liked, .disliked {
                            font-weight: bold;
                            color: #1565c0;
                        }
                    `}</style>
    </>
  );
};

export default TestPage;
