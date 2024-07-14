import React, { useState } from 'react';
import '../styles/authPage.css';
import AuthForm from '../components/Auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (email: string, password: string) => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate('/home');
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
        console.log(error);
      }
    }
  };

  return (
  <div className='page'>
      <div className="auth-container">
        <div className="auth-left">
          {isLogin ? (
            <>
              <h1>Welcome!</h1>
              <p>If you don't have an account, please click here to create one.</p>
              <button className="btn" onClick={() => setIsLogin(false)}>SIGN UP</button>
            </>
          ) : (
            <>
              <h1>Welcome!</h1>
              <p>Already have an account? Please log in using your personal information.</p>
              <button className="btn" onClick={() => setIsLogin(true)}>SIGN IN</button>
            </>
          )}
        </div>
        <div className="auth-right">
          <h1>{isLogin ? 'Log In' : 'Create Account'}</h1>
          <AuthForm type={isLogin ? 'login' : 'register'} onSubmit={handleAuth} />
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
