import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { addComment, editComment, getPost, likePost, removeComment } from '../services/PostService';
import EditCommentForm from './EditCommentForm';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import NavMenu from './NavMenu';

const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isUserLoggedIn } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [editFormId, setEditFormId] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [post, setPost] = useState(null) as any;
  const [comments, setComments] = useState([]) as any;

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      comment: '',
    }
  });

  const getData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
      setIsLoadingComments(true);
    }
    setErrorMsg('');
    try {
      const res = await getPost(id as string);
      const data = await res.json();
      setIsLoading(false);
      setIsLoadingComments(false);
      setErrorMsg('');
      if (data.success === false) {
        setPost(null);
        setErrorMsg(data);
      }
      else {
        console.log(data);
        setComments(data.comments);
        setPost(data.post);
      }
    } catch (error) {
      setErrorMsg('Server Error');
    }
  }, [id]);

  const createComment = async () => {
    try {
      setIsCommenting(true);
      const upload = await addComment(id as string, getValues('comment'));
      const data = await upload.json();
      setIsCommenting(false);
      if (data.success === true) {
        console.log(data);
        setComments([data.saved].concat(comments));
        const countComment = post;
        countComment.comments = post.comments + 1;
        setPost(countComment);
        setValue('comment', '');
        getData(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteComment = async (cid: any) => {
    try {
      setIsCommenting(true);
      const del = await removeComment(cid as string, id as string);
      const data = await del.json();
      setIsCommenting(false);
      if (data.success === true) {
        console.log(data);
        if (data.item) {
          const items = comments.filter((i: any) => i._id !== cid);
          setComments(items);
          const countComment = post;
          countComment.comments = post.comments - 1;
          setPost(countComment);
        }
        getData(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const saveComment = async (value: string) => {
    const cid = editFormId;
    if(!cid) {return;}
    setEditFormId('');
    setIsCommenting(true);
    try {
      const del = await editComment(cid, id as string, value);
      const data = await del.json();
      setIsCommenting(false);
      if (data.success === true) {
        console.log(data);
        getData(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsCommenting(false);
    }
  };

  const addLike = async () => {
    setIsCommenting(true);
    try {
      const add = await likePost(id as string);
      const data = await add.json();
      setIsCommenting(false);
      if (data.success === true) {
        console.log(data);
        getData(false);
      }
    } catch (error) {
      console.log(error);
      setIsCommenting(false);
    }
  };

  const formatDate = (item: any) => {
    const d1 = new Date(item.createdAt).toLocaleString('en-US');
    const d2 = new Date(item.updatedAt).toLocaleString('en-US');
    if (d1 === d2) {
      return [d1, ''];
    }
    return [d1, d2];
  };

  const showEditUi = async (item: any) => {
    if(editFormId === item._id) return setEditFormId('');
    setEditFormId(item._id);
  };

  useEffect(() => {
    if (!id) {
      return navigate('/');
    }
    getData();
  }, [getData, id, navigate]);

  return (
    <>
      <NavMenu />
      <section className="my-20">
        {
          errorMsg !== '' && <div className="rounded-lg mt-8 text-center px-4 py-8 text-black">{errorMsg}</div>
        }
        {
          isLoading && <div className="mt-8 text-center px-4 py-8 text-black"><LoadingSpinner size="3rem" /></div>
        }
        {
          !isLoading && post !== null &&
          <div className="w-full relative px-2 rounded-xl mx-auto bg-white md:drop-shadow-lg sm:px-0 sm:w-3/4 md:w-2/4">
            <div className="px-6 py-2 rounded-t-xl text-white bg-neutral-900 text-xs sm:text-base">{post.title}</div>
            <img className="md:drop-shadow-lg" src={post.image} alt="" />
            <div className="flex items-center justify-evenly rounded-b-xl px-6 py-2 text-xs text-white bg-neutral-900">
              <button type="button" onClick={() => addLike()} className="gap-1 flex items-center justify-between hover:cursor-pointer">
                <div className="text-red-600 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </div>
                <div>
                  {post.likes}
                </div>
              </button>
              <div className="gap-1 flex items-center justify-between">
                <div className="text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 00-.266.112L8.78 21.53A.75.75 0 017.5 21v-3.955a48.842 48.842 0 01-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  {post.comments}
                </div>
              </div>
            </div>
          </div>
        }
        <div className="mt-20 w-full px-2 mx-auto sm:px-0 sm:w-3/4 md:w-2/4">
          <h2 className="text-center mb-10 section-line font-bold uppercase text-2xl lg:text-4xl">Comments</h2>
        </div>
        <form onSubmit={handleSubmit(() => { createComment() })} className="relative rounded-lg mt-8 p-8 text-black w-full mx-auto bg-white md:drop-shadow-lg sm:w-3/4 md:w-2/4" noValidate>
          {!isUserLoggedIn && <div className="absolute rounded-lg align-middle w-full h-full text-white comment-deny text-sm md:text-lg">You must be logged in to post a comment.</div>}
          <div className="mb-6">
            <input disabled={!isUserLoggedIn || isCommenting || isLoading || isLoadingComments} {...register("comment", {
              required: 'Comment is required',
              minLength: { value: 6, message: 'Comment is too short!' },
              maxLength: { value: 255, message: 'Comment is too long!' }
            })} autoComplete="off" type="text" id="comment" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Leave a comment..." />
          </div>
          <button disabled={!isUserLoggedIn || isLoading || isLoadingComments} type="submit" className="w-full my-2 text-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300 transition-colors ease-in-out">
            {!isCommenting || isLoading || isLoadingComments ? 'Add Comment' : <LoadingSpinner />}
          </button>
          <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.comment?.message}</p></div>
        </form>
        {isLoadingComments && <div className="text-center px-1 py-1 text-black"><LoadingSpinner size="3rem" /></div>}
        {
          !isLoadingComments && comments.length === 0 ?
            <div>
              <h3 className="rounded-lg text-center mt-8 py-8 text-black w-full px-2 mx-auto bg-white md:drop-shadow-lg sm:px-0 sm:w-3/4 md:w-2/4">No Comments</h3>
            </div>
            :
            comments.map((item: any) =>
              <div key={item._id} className="relative rounded-lg py-2 font-semibold mt-8 text-black w-full mx-auto bg-white md:drop-shadow-lg sm:w-3/4 md:w-2/4 last:mb-28">
                {item.isAuthor &&
                  <div className="absolute top-2 right-2 flex items-center justify-end gap-1">
                    <button type="button" disabled={isCommenting || !isUserLoggedIn || isLoadingComments} onClick={() => showEditUi(item)} className="text-blue-900 opacity-20 transition-opacity ease-in-out hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                      </svg>
                    </button>
                    <button type="button" disabled={isCommenting || !isUserLoggedIn || isLoadingComments} onClick={() => deleteComment(item._id)} className="text-red-600 opacity-20 transition-opacity ease-in-out hover:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                }
                <p className="px-2 break-words sm:px-4">{item.text}</p>
                <div style={{ height: "1px", borderTop: "1px solid #e8e8e8" }} className="mb-2 mt-4"></div>
                <div className="text-sm font-normal flex items-center gap-2 justify-between px-2 sm:px-4">
                  <p>{item.author.username} {item.isAuthor && <span className="text-green-500 font-bold">(You)</span>}</p>
                  <p className="text-xs h-8">
                    {formatDate(item)[0]}
                    {<span className="text-xs text-gray-500"><br/>{formatDate(item)[1]}</span>}
                    </p>
                </div>
                {editFormId === item._id && <EditCommentForm onClick={(value: any) => saveComment(value)} text={item.text} disableInput={false} isLoggedIn={isUserLoggedIn} />}
                
              </div>
            )
        }
      </section>
      <Footer />
    </>
  )
}

export default View