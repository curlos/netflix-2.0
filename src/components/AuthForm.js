import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';

const AuthForm = ({ mode }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = mode === 'login';
  const title = isLogin ? 'Sign In' : 'Sign Up';
  const buttonText = isLogin ? 'Sign In' : 'Sign Up';
  const linkText = isLogin ? 'Sign Up now.' : 'Login now.';
  const linkPath = isLogin ? '/signup' : '/login';
  const promptText = isLogin ? 'New to Netflix?' : 'Have an account?';

  const handleSubmit = (e) => {
    e.preventDefault();

    const authMethod = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    
    authMethod(auth, emailRef.current.value, passwordRef.current.value)
      .then((authUser) => {
        dispatch(login({
          uid: authUser.user.uid,
          email: authUser.user.email,
        }));
        navigate('/');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="authPage d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-between fixed-top p-4 container mx-auto px-3 px-sm-0">
        <Link to="/">
          <img src="/assets/netflix_logo.png" alt="" className="authLogo" />
        </Link>
      </div>

      <div className="container mx-auto px-3 px-sm-0 d-flex justify-content-center">
        <form className={`authForm ${isLogin ? 'w-100' : ''}`} onSubmit={handleSubmit}>
          <div className="fs-2 fw-bold">{title}</div>

          {isLogin ? (
            <>
              <input ref={emailRef} type="text" className="w-100 my-3 authInput" placeholder="Email" />
              <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password" />
            </>
          ) : (
            <div className="my-3">
              <input ref={emailRef} type="text" className="w-100 mb-3 authInput" placeholder="Email" />
              <input ref={passwordRef} type="password" className="w-100 authInput" placeholder="Password" />
            </div>
          )}

          <button type="submit" className="w-100 my-4 netflixRedButton">{buttonText}</button>

          <div>
            <span className="text-lightgray">{promptText}</span>
            <Link to={linkPath} className="authLink">{linkText}</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;