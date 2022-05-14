import Modal from '../components/Modal';
import PostSignupForm from '../components/PostSignupForm/PostSignupForm';

const SignupSuccess = () => {
  return (
    <div>
      <Modal isOpen closeButtonVisible={false}>
        <PostSignupForm />
      </Modal>
    </div>
  );
};

export default SignupSuccess;
