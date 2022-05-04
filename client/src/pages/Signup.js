import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../components/Modal';
import SignupForm from '../components/SignupForm/SignupForm';

import { GOOGLE_CLIENT_ID } from '../utils/config';
import { loadScript } from '../utils/utils';
import * as logger from '../utils/logger';

const Signup = () => {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadGoogleSDK = async () => {
      try {
        await loadScript('https://accounts.google.com/gsi/client');
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            logger.info(response);
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
  }, []);

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
          <div className="bg-on-background h-px flex-1" />
          <div className="text-on-background">or</div>
          <div className="bg-on-background h-px flex-1" />
        </div>
        <div className="mb-4">
          <button
            type="button"
            className="font-raleway bg-primary text-on-primary rounded-full font-semibold block w-full py-4"
            onClick={() => setModalOpen(true)}
          >
            Sign up with phone or email
          </button>
        </div>
        <div>
          <h4 className="text-on-background font-bold text-base mb-2">
            Already have an account?
          </h4>
          <Link
            to="/signin"
            className="font-raleway bg-transparent border border-solid border-primary rounded-full font-semibold  w-full py-4 inline-block text-center text-primary"
          >
            Sign in
          </Link>
        </div>
        <Modal modalOpen={modalOpen} closeModal={() => setModalOpen(false)}>
          <SignupForm closeModal={() => setModalOpen(false)} />
        </Modal>
      </div>
    </div>
  );
};

export default Signup;
