import { useEffect, useState } from 'react';
import NavMenu from './NavMenu';
import LoadingSpinner from '../components/LoadingSpinner';
import Masonry from 'react-masonry-css'
import { getAllPosts } from '../services/PostService';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [posts, setPosts] = useState([]) as any;

  const truncate = (str: string) => {
    return str.length > 40 ? str.substring(0, 37) + '...' : str;
  }

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setErrorMsg('');
      try {
        const res = await getAllPosts();
        const data = await res.json();
        if (data.success === false) {
          setPosts([]);
          setIsLoading(false);
          setErrorMsg(data.message);
          //setErrorMsg(upload.message);
        }
        else {
          console.log(data);
          setPosts(data);
          setIsLoading(false);
          setErrorMsg('');
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMsg('Server Error');
      }

    };
    getData();
  }, []);
  return (
    <>
      <NavMenu />
      <header className="bg-slate-100 drop-shadow-lg shadow-md py-60 header-img relative">
        <div className="header-text-container py-60"></div>
        <div className="text-center header-text">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-8xl">PictureApp</h1>
          <p className="text-xl mt-2 lg:text-2xl">The best app for sharing your photos!</p>
        </div>
      </header>

      <section className="mx-auto py-20 px-4 md:px-24 lg:px-36">
        <h2 className="text-center mb-20 section-line font-bold uppercase text-2xl lg:text-4xl">Latest photos</h2>
        {
          errorMsg !== '' && <div className="rounded-lg mt-8 bg-gray-300 px-4 py-8 text-black">{errorMsg}</div>
        }
        {
          isLoading && <div className="mt-8 text-center px-4 py-8 text-black"><LoadingSpinner size="3rem" /></div>
        }
        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column">

          {posts.map((item: any) =>
            <div className="relative rounded-xl drop-shadow-md shadow-md transition-all ease-in-out brightness-100 hover:brightness-125" key={item._id}>
              <Link to={"/view/" + item._id}>
                <div>
                  <img className="rounded-t-xl hover:cursor-pointer" alt={item.filename} src={item.image} />
                </div>
              </Link>
              <div className="px-6 py-2 text-xs text-white bg-gray-700">{truncate(item.title)}</div>
              <div className="flex items-center justify-evenly rounded-b-xl px-6 py-2 text-xs text-white bg-gray-700">
                <div className="gap-1 flex items-center justify-between hover:cursor-pointer">
                  <div className="text-red-600 hover:text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </div>
                  <div>
                    {item.likes}
                  </div>
                </div>
                <Link to={"/view/" + item._id}>
                  <div className="gap-1 flex items-center justify-between hover:cursor-pointer">
                    <div className="text-gray-300 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 00-.266.112L8.78 21.53A.75.75 0 017.5 21v-3.955a48.842 48.842 0 01-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      {item.comments}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </Masonry>
      </section>
      <Footer />
    </>
  )
}

export default Home