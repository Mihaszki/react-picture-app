import React, { useEffect, useState } from 'react'
import { likePost, removeLike } from '../services/PostService';

type Props = {
  userId: string;
  postId: string;
  likes: number;
  isLiked: boolean;
  onRequestSuccess: () => void;
}

const LikesButton = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLikedLocal, setIsLikedLocal] = useState(false);

  useEffect(() => {
    setIsLikedLocal(props.isLiked);
  }, []);

  const addLike = async () => {
    if (props.isLiked) {
      return deleteLike();
    }
    setIsLoading(true);
    try {
      const add = await likePost(props.postId as string);
      const data = await add.json();
      setIsLoading(false);
      if (data.success === true) {
        setIsLikedLocal(true);
        props.onRequestSuccess();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteLike = async () => {
    setIsLoading(true);
    try {
      const add = await removeLike(props.postId as string);
      const data = await add.json();
      setIsLoading(false);
      if (data.success === true) {
        setIsLikedLocal(false);
        props.onRequestSuccess();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <button disabled={isLoading} type="button" onClick={() => addLike()}
      className={"gap-1 flex items-center justify-between hover:cursor-pointer" + (isLikedLocal && " post-liked")}>
      <div className="text-red-600 hover:text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </div>
      <div>
        {props.likes}
      </div>
    </button>
  )
}

export default LikesButton