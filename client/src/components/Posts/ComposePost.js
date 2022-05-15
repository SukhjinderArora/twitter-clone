import { IconContext } from 'react-icons';
import { RiAddLine } from 'react-icons/ri';

import usePageTitle from '../../hooks/usePageTitle';

import TextArea from '../TextArea';
import Button from '../Button';

import useForm from '../../hooks/useForm';

const autoExpandTextArea = (element) => {
  element.style.height = 'inherit';
  const computed = window.getComputedStyle(element);
  const height =
    parseInt(computed.getPropertyValue('border-top-width'), 10) +
    parseInt(computed.getPropertyValue('padding-top'), 10) +
    element.scrollHeight +
    parseInt(computed.getPropertyValue('padding-bottom'), 10) +
    parseInt(computed.getPropertyValue('border-bottom-width'), 10);
  element.style.height = `${height}px`;
};

const ComposePost = () => {
  usePageTitle('New Post / Kookoo');
  const form = useForm({
    initialValues: {
      content: '',
    },
    onSubmit: () => {},
  });
  const onContentChange = (evt) => {
    autoExpandTextArea(evt.target);
    form.handleChange(evt);
  };
  return (
    <div className="p-6">
      <form onSubmit={form.handleSubmit} className="flex flex-col">
        <TextArea
          id="content"
          name="content"
          label="What's happening?"
          value={form.values.content}
          error={form.errors.content}
          onBlur={form.handleBlur}
          onChange={onContentChange}
          onFocus={form.handleFocus}
        />
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
