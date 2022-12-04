import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import Logo from '../components/Logo';
import { UserContext } from '../contexts/UserContext';
import { logout } from '../services/AuthService';

const NavMenu = () => {
  const [height, setHeight] = useState(0);
  const ref = useRef(null) as any;
  const navigate = useNavigate();
  const { isUserLoggedIn, setIsUserLoggedIn, setUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const styles = {
    mobileMenu: { transform: open ? 'translateX(0)' : 'translateX(100%)' },
    menuBtn: { display: open ? 'none' : 'block' },
    closeBtn: { display: open ? 'block' : 'none' },
  };

  useLayoutEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [])

  const onLogout = () => {
    logout();
    setIsUserLoggedIn(false);
    setUser(null);
    navigate('/');
  }

  return (
    <>
      <nav ref={ref} className="text-sm md:text-base nav-menu">
        <div className="sticky top-0 z-30 w-full px-2 py-2 sm:px-4 shadow-md">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            <NavLink to="/">
              <button type="button" className="flex items-center text-blue-500">
                <Logo />
              </button>
            </NavLink>
            <div className="flex items-center space-x-1">
              <ul className="hidden space-x-2 md:inline-flex">
                {
                  isUserLoggedIn ?
                    <>
                      <li>
                        <NavLink to="/upload">
                          <button type="button" className="m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                            </svg>
                            Upload
                          </button>
                        </NavLink>
                      </li>
                      <li>
                        <button type="button" className="m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200" onClick={() => onLogout()}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Logout
                        </button>
                      </li>
                    </>
                    :
                    <li>
                      <NavLink to="/login">
                        <button type="button" className="m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Login
                        </button>
                      </NavLink>
                    </li>
                }
              </ul>
              <div className="inline-flex md:hidden">
                <button className="flex-none px-2 z-50 text-black" onClick={() => setOpen(!open)}>
                  <div style={styles.menuBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  </div>

                  <div style={styles.closeBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </button>
                <ul className="space-y-2 block z-30 fixed h-screen transition-transform ease-in-out bg-white shadow-md py-20 text-center top-0 right-0 text-lg w-full md:w-1/2 md:hidden"
                  style={styles.mobileMenu}>
                  {
                    isUserLoggedIn ?
                      <>
                        <li>
                          <NavLink to="/upload">
                            <button type="button" className="w-full m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                              </svg>
                              Upload
                            </button>
                          </NavLink>
                        </li>
                        <li>
                          <button type="button" className="w-full m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200" onClick={() => onLogout()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Logout
                          </button>
                        </li>
                      </>
                      :
                      <li>
                        <NavLink to="/login">
                          <button type="button" className="w-full m-0 px-4 py-2 font-semibold text-gray-600 transition-all ease-in-out rounded flex items-center justify-center hover:bg-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline mr-2 w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Login
                          </button>
                        </NavLink>
                      </li>
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ height: height + 'px' }}></div>
    </>
  )
}

export default NavMenu