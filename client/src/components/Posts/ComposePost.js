import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { RiAddLine } from 'react-icons/ri';

import usePageTitle from '../../hooks/usePageTitle';

import TextArea from '../TextArea';
import Button from '../Button';

import useForm from '../../hooks/useForm';

import axios from '../../utils/axios';
import { newPostValidator } from '../../utils/validator';

const ComposePost = () => {
  usePageTitle('New Post / Kookoo');
  const navigate = useNavigate();
  const createNewPost = useMutation(({ content }) => {
    return axios.post('/api/post/create-post', {
      content,
    });
  });
  const { validateForm } = newPostValidator;
  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: validateForm,
    onSubmit: (values) => {
      createNewPost.mutate(
        {
          content: values.content,
        },
        {
          onSuccess: () => {
            navigate('/home');
          },
          onError: (err) => {
            const error = err.response.data.errors || err.response.data.error;
            if (Array.isArray(error)) {
              const errors = error.reduce((acc, cur) => {
                acc[cur.param] = cur.msg;
                return acc;
              }, {});
              form.setMultipleFieldsError(errors);
            } else {
              form.setFieldError('password', error.message);
            }
          },
        }
      );
    },
  });
  return (
    <div className="p-6">
      <form onSubmit={form.handleSubmit} className="flex flex-col">
        <TextArea
          id="content"
          name="content"
          label="What's happening?"
          value={form.values.content}
          error={form.touched.content ? form.errors.content : ''}
          autoExpand
          onBlur={form.handleBlur}
          onChange={form.handleChange}
          onFocus={form.handleFocus}
        />
        <div className="text-right text-on-surface my-3">
          <span
            className={
              form.values.content.length > 255
                ? 'text-on-error'
                : 'text-on-surface'
            }
          >
            {form.values.content.length}
          </span>
          <span> / </span>
          <span>255</span>
        </div>
        <div className="w-1/2 self-end">
          <Button type="submit">
            <span>Add</span>
            <div className="text-on-primary ml-1">
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{
                  size: '16px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiAddLine />
              </IconContext.Provider>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ComposePost;
