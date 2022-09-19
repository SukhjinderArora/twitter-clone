/* eslint-disable react/jsx-no-constructed-context-values */
import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiSendPlane2Line, RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { useMutation, useQueryClient } from 'react-query';

import dayjs from '../utils/day';

import useChat from '../hooks/useChat';
import useForm from '../hooks/useForm';

import { useAuth } from '../contexts/auth-context';
import { useSocket } from '../contexts/socket-context';

import Spinner from '../components/Spinner';

import axios from '../utils/axios';
import { messageValidator } from '../utils/validator';

const Chat = () => {
  const { chatId } = useParams();
  const { user } = useAuth();
  const { data, isLoading, isError } = useChat(chatId);
  const queryClient = useQueryClient();
  const socket = useSocket();
  const messagesRef = useRef(null);

  const navigate = useNavigate();

  const sendMessage = useMutation(async ({ content }) => {
    return axios.post(`/api/chat/${chatId}/message`, {
      content,
    });
  });

  const markMessagesAsRead = useMutation(
    async () => {
      return axios.patch(`/api/chat/${chatId}/messages/read`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chat', chatId]);
        queryClient.invalidateQueries('messages');
      },
    }
  );

  const { validateForm } = messageValidator;

  const form = useForm({
    initialValues: {
      content: '',
    },
    validate: validateForm,
    onSubmit: (values, { resetForm }) => {
      sendMessage.mutate(
        {
          content: values.content,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['chat', chatId]);
            queryClient.invalidateQueries('messages');
            socket.emit('new message', {
              chatId: data.chat.id,
            });
            resetForm();
          },
        }
      );
    },
  });

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [data, chatId]);

  useEffect(() => {
    if (data) {
      markMessagesAsRead.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    chatId,
    // exclude mutations - because markMessagesAsRead is an unstable refrence and linter prevents listing only mutation function
  ]);

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="flex flex-col justify-between sm:border-l sm:border-on-surface/20 min-h-full h-fit relative">
      <div className="px-4 py-2 sticky top-0 backdrop-blur-sm">
        <div className="flex justify-between items-center gap-3">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-on-surface"
            >
              <IconContext.Provider
                // eslint-disable-next-line react/jsx-no-constructed-context-values
                value={{
                  size: '18px',
                  style: {
                    color: 'inherit',
                  },
                }}
              >
                <RiArrowLeftLine />
              </IconContext.Provider>
            </button>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <div className="h-6 w-6 overflow-hidden">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://i.pravatar.cc/300"
                alt="avatar"
              />
            </div>
            <div>
              <h3 className="text-on-surface font-bold text-base">
                {data.chat.participant.profile.name}
              </h3>
              <h5 className="text-on-surface/70 text-xs">
                @{data.chat.participant.username}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        {data.chat.messages.map((message) => {
          if (message.userId === user.id) {
            return (
              <div
                className="flex flex-col items-end gap-1 mb-5"
                key={message.id}
              >
                <p className="bg-primary text-on-primary text-base p-3 rounded-t-xl rounded-bl-xl max-w-[80%] break-words">
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
              className="flex flex-col items-start gap-1 mb-5"
              key={message.id}
            >
              <p className="bg-on-surface/30 text-on-surface text-base p-3 rounded-t-xl rounded-br-xl max-w-[80%] break-words">
                {message.content}
              </p>
              <span className="text-on-surface/80 font-light text-xs">
                {dayjs(message.createdAt).format('MMM D, YYYY, hh:mm A')}
              </span>
            </div>
          );
        })}
      </div>
      <div ref={messagesRef} className="min-h-16" />
      <div className="sticky bottom-0 left-0 w-full">
        <form
          onSubmit={form.handleSubmit}
          className="flex justify-evenly items-center border-t border-on-surface/30 pt-2 bg-surface"
        >
          <div className="relative w-[80%]">
            <textarea
              name="content"
              id="content"
              className="bg-surface text-on-surface border border-on-surface/30 w-[100%] rounded-3xl px-4 py-3 text-sm peer outline-none focus:border-primary h-12"
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
