import { useState } from 'react';

import Modal from '../components/Modal';
import PostSignupForm from '../components/PostSignupForm/PostSignupForm';

const SignupSuccess = () => {
  const [openPostSignupModal, setOpenPostSignupModal] = useState(true);

  return (
    <div>
      <Modal
        modalOpen={openPostSignupModal}
        closeModal={() => {}}
        closeButtonVisible={false}
      >
        <PostSignupForm closeModal={() => setOpenPostSignupModal(false)} />
      </Modal>
    </div>
  );
};

export default SignupSuccess;
