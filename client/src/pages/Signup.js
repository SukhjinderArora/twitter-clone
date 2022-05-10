import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import Modal from '../components/Modal';
import Button from '../components/Button';
import SignupForm from '../components/SignupForm/SignupForm';

import { useAuth } from '../contexts/auth-context';

import { GOOGLE_CLIENT_ID } from '../utils/config';
import { loadScript } from '../utils/utils';
import * as logger from '../utils/logger';

const Signup = () => {
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const googleSignup = useMutation(({ token }) => {
    return axios.post('/api/auth/signup/google', { token });
  });

  useEffect(() => {
    const loadGoogleSDK = async () => {
      try {
        await loadScript('https://accounts.google.com/gsi/client');
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => {
            googleSignup.mutate(
              { token: response.credential },
              {
                onSuccess: (res) => {
                  const { user, accessToken, expiresAt } = res.data;
                  login(user, accessToken, expiresAt);
                  if (!user.newUser) {
                    navigate('/');
                  } else {
                    navigate('success');
                  }
                },
                onError: (error) => {
                  logger.error(error);
                },
              }
            );
          },
          ux_mode: 'popup',
          context: 'signup',
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google'),
          {
            size: 'medium',
            type: 'standard',
            shape: 'pill',
            theme: 'filled_blue',
            text: 'signup_with',
            logo_alignment: 'left',
          }
        );
      } catch (error) {
        logger.error(error);
      }
    };
    loadGoogleSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    navigate,
    login,
    // exclude mutations - linter prevents listing only mutation function
  ]);

  return (
    <div className="bg-background h-screen py-10 px-10 flex justify-center items-center">
      <div className="max-w-xs w-full">
        <div className="mb-4">
          <h3 className="text-on-background text-3xl font-black text-center">
            Join Kookoo today.
          </h3>
        </div>
        <div className="mb-4">
          <div id="google" className="flex justify-center" />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-on-background/60 h-px flex-1" />
          <div className="text-on-background">or</div>
          <div className="bg-on-background/60 h-px flex-1" />
        </div>
        <div className="mb-4">
          <Button type="button" onClick={() => setOpenSignupModal(true)}>
            Sign up with phone or email
          </Button>
        </div>
        <div>
          <h4 className="text-on-background font-bold text-base mb-2">
            Already have an account?
          </h4>
          <Link
            to="/signin"
            className="font-source-sans-pro bg-transparent border border-solid border-primary rounded-full font-semibold  w-full py-4 inline-block text-center text-primary"
          >
            Sign in
          </Link>
        </div>
        <Modal
          modalOpen={openSignupModal}
          closeModal={() => setOpenSignupModal(false)}
        >
          <SignupForm />
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
