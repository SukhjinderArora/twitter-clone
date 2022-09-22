import { Outlet, NavLink } from 'react-router-dom';
import { useQuery } from 'react-query';

import Spinner from '../components/Spinner';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/auth-context';
import axios from '../utils/axios';
import usePageTitle from '../hooks/usePageTitle';

const Messages = () => {
  usePageTitle('Messages / Kookoo');
  const { isAuthenticated, user } = useAuth();
  const messagesQuery = useQuery(
    'messages',
    async () => {
      try {
        const response = await axios.get(`/api/chat/all`);
        return response.data;
      } catch (error) {
        return error;
      }
    },
    {
      enabled: !!isAuthenticated,
      refetchOnWindowFocus: false,
    }
  );

  if (messagesQuery.isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  if (messagesQuery.isError) return <div>Something went wrong.</div>;

  return (
    <div className="flex sm:h-full">
      <div className="static top-0 overflow-y-auto overflow-x-hidden h-[calc(100vh_-_56px)] flex-1 sm:h-full">
        <div className="sticky top-0 left-0 w-full">
          <PageHeader title="Messages" />
        </div>
        <div>
          {messagesQuery.data.chats.map((chat) => {
            const latestMessage = chat.messages[chat.messages.length - 1];
            const unReadMessages = chat.messages.reduce(
              (acc, cur) =>
                cur.userId !== user.id && !cur.read ? acc + 1 : acc,
              0
            );
            return (
              <NavLink
                to={`${chat.id}`}
                className={({ isActive }) =>
                  isActive
                    ? 'flex px-4 py-2 items-center gap-1 bg-on-surface/10'
                    : 'flex px-4 py-2 items-center gap-1'
                }
                key={chat.id}
              >
                <div className="h-10 w-10 overflow-hidden">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={chat.participant.profile.img}
                    alt="avatar"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      <h3 className="font-bold text-on-surface">
                        {chat.participant.profile.name}
                      </h3>
                      <span className="text-on-surface/70 font-semibold text-sm">
                        @{chat.participant.username}
                      </span>
                    </div>
                    <span className="text-on-surface/70">1d</span>
                  </div>
                  <div className="flex justify-between">
                    {latestMessage?.userId === user.id ? (
                      <p className="text-on-surface/80 font-medium empty:after:content-['']  empty:inline-block">
                        {latestMessage?.content &&
                          `You: ${latestMessage?.content}`}
                      </p>
                    ) : (
                      <p
                        className={`text-on-surface/80 ${
                          latestMessage?.read ? 'font-medium' : 'font-semibold'
                        }  empty:after:content-[''] empty:after:inline-block`}
                      >
                        {latestMessage?.content}
                      </p>
                    )}
                    {unReadMessages > 0 && (
                      <div className="bg-primary w-5 h-5 flex items-center justify-center p-3 rounded-full">
                        <span className="text-on-primary text-xs font-semibold">
                          {unReadMessages}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="flex-1 empty:hidden static top-0 overflow-y-auto overflow-x-hidden h-[calc(100vh_-_56px)] sm:h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Messages;
