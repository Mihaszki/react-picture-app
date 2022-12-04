import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../services/AuthService';
import LoadingSpinner from '../components/LoadingSpinner';
import Logo from '../components/Logo';

const Register = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async () => {
    setIsLoading(true);
    const { username, email, password } = getValues();
    setErrorMsg('');
    try {
      const response = await registerUser(username, email, password);
      const json = await response.json();
      if (response.status === 400) {
        setErrorMsg(json.message || 'Server Error!');
      }
      else if (response.status === 200) {
        navigate('/login?register=success');
      }
      setIsLoading(false);
    } catch (error) {
      setErrorMsg(`Server Error!`);
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <div>
        <div className="flex flex-col items-center justify-center absolute w-full z-50 sm:px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link to="/">
            <button type="button" className="flex items-center mb-6 text-2xl text-white lg:text-4xl">
              <Logo />
            </button>
          </Link>
          <div className="w-full bg-white rounded-lg max-w-full shadow-0 sm:shadow-xl md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-4 space-y-4 shadow-0 md:space-y-6 sm:p-8 sm:shadow-xl">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Create a new account
              </h1>
              <form noValidate onSubmit={handleSubmit(() => { onSubmit() })}>
                <div className="mt-2">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                  <input type="email" {...register("email", {
                    required: 'Email is required', pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format!"
                    }, minLength: { value: 6, message: 'Email is too short!' }
                  })} id="email" aria-label="Email field" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="name@email.com" />
                </div>
                <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.email?.message}</p></div>
                <div className="mt-2">
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                  <input type="text" {...register("username", { required: 'Username is required!', minLength: { value: 6, message: 'Username is too short!' } })} id="username" required className="bg-gray-50 border border-gray-300 caret-black text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="John Snow" />
                </div>
                <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.username?.message}</p></div>
                <div className="mt-2">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                  <input type="password" {...register("password", { required: 'Password is required!', minLength: { value: 6, message: 'Password is too short!' } })} id="password" required placeholder="••••••••" className="bg-gray-50 border caret-black border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                </div>
                <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.password?.message}</p></div>
                <div className="mt-2">
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                  <input type="password" {...register("confirmPassword", { required: 'Confirm password is required!', validate: v => v === getValues().password || 'Passwords should match!' })} id="confirmpassword" required placeholder="••••••••" className="bg-gray-50 caret-black	border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
                </div>
                <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errors.confirmPassword?.message}</p></div>
                <div className="mt-1"><p className="text-red-700 h-5 text-xs">{errorMsg}</p></div>
                <button disabled={isLoading} type="submit" className="w-full my-2 text-gray-700 focus:ring-4 focus:outline-none focus:ring-primary-300 border border-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hover:bg-gray-300 transition-colors ease-in-out">
                  {!isLoading ? 'Create an account' : <LoadingSpinner />}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Already have an account? <Link to="/login"><span className="font-medium text-primary-600 hover:underline">Login here.</span></Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Register