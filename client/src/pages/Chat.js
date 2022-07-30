/* eslint-disable react/jsx-no-constructed-context-values */
import { useParams } from 'react-router-dom';
import { RiSendPlane2Line } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useMutation, useQueryClient } from 'react-query';

import dayjs from '../utils/day';

import useChat from '../hooks/useChat';
import { useAuth } from '../contexts/auth-context';
import useForm from '../hooks/useForm';

import Spinner from '../components/Spinner';

import axios from '../utils/axios';
import { messageValidator } from '../utils/validator';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = useChat(chatId);
  const queryClient = useQueryClient();

  const sendMessage = useMutation(async ({ content }) => {
    return axios.post(`/api/chat/${chatId}/message`, {
      content,
    });
  });

  const { validateForm } = messageValidator;

  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: validateForm,
    onSubmit: (values) => {
      sendMessage.mutate(
        {
          content: values.content,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['chat', chatId]);
          },
        }
      );
    },
  });

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="messages p-4">
        {data.chat.messages.map((message) => {
          if (message.userId === user.id) {
            return (
              <div
                className="sentMessage flex flex-col items-end gap-1 mb-5"
                key={message.id}
              >
                <p className="bg-primary text-on-primary text-base p-3 rounded-t-xl rounded-bl-xl max-w-[80%]">
                  {message.content}
                </p>
                <span className="text-on-surface/80 font-light text-xs">
                  {dayjs(message.createdAt).format('MMM D, YYYY, hh:mm A')}
                </span>
              </div>
            );
          }
          return (
            <div
              className="receivedMessage flex flex-col items-start gap-1 mb-5"
              key={message.id}
            >
              <p className="bg-on-surface/30 text-on-surface text-base p-3 rounded-t-xl rounded-br-xl max-w-[80%]">
                {message.content}
              </p>
              <span className="text-on-surface/80 font-light text-xs">
                {dayjs(message.createdAt).format('MMM D, YYYY, hh:mm A')}
              </span>
            </div>
          );
        })}
      </div>
      <div className="sticky bottom-0 left-0 w-full">
        <form
          onSubmit={form.handleSubmit}
          className="flex justify-evenly items-center border-t border-on-surface/30 pt-2 bg-surface"
        >
          <div className="relative w-[80%]">
            <textarea
              name="content"
              id="content"
              className="bg-surface text-on-surface border border-on-surface/30 w-[100%] rounded-3xl px-4 py-3 text-sm peer outline-none focus:border-primary"
              placeholder="Send new message"
              rows="1"
              value={form.values.content}
              onChange={form.handleChange}
            />
          </div>
          <div>
            <button type="submit" className="text-primary">
              <IconContext.Provider
                value={{
                  size: '24px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiSendPlane2Line />
              </IconContext.Provider>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
