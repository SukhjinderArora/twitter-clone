import { Fragment, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import useNotifications from '../hooks/useNotifications';
import axios from '../utils/axios';

import { NOTIFICATION_TYPE } from '../utils/utils';

import Header from '../components/mobile/Header';
import Spinner from '../components/Spinner';
import FollowNotification from '../components/Notifications/FollowNotification';
import LikeNotification from '../components/Notifications/LikeNotification';
import RepostNotification from '../components/Notifications/RepostNotification';
import ReplyNotification from '../components/Notifications/ReplyNotification';

const Notifications = () => {
  const { data, hasNextPage, isLoading, fetchNextPage } = useNotifications();
  const queryClient = useQueryClient();
  const isInitialStrictModeMount = useRef(true);
  const markNotificationAsRead = useMutation(
    async () => {
      try {
        const response = await axios.patch('/api/notification/read/all');
        return response.data;
      } catch (error) {
        return error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  useEffect(
    () => {
      return () => {
        if (!isInitialStrictModeMount.current) {
          markNotificationAsRead.mutate();
        }
        isInitialStrictModeMount.current = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // exclude mutations - because markNotificationAsRead is an unstable refrence and linter prevents listing only mutation function
    ]
  );

  const renderNotification = (notification) => {
    switch (notification.type) {
      case NOTIFICATION_TYPE.FOLLOW:
        return (
          <FollowNotification
            notification={notification}
            key={notification.id}
          />
        );
      case NOTIFICATION_TYPE.LIKE:
        return (
          <LikeNotification notification={notification} key={notification.id} />
        );
      case NOTIFICATION_TYPE.REPOST:
        return (
          <RepostNotification
            notification={notification}
            key={notification.id}
          />
        );
      case NOTIFICATION_TYPE.REPLY:
        return (
          <ReplyNotification
            notification={notification}
            key={notification.id}
          />
        );
      default:
        return null;
    }
  };
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="pb-24 mt-14">
      <div className="fixed top-0 left-0 w-full">
        <Header pageTitle="Notifications" />
      </div>
      {data.pages.map((group, i) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>{group.results.map(renderNotification)}</Fragment>
        );
      })}
      {hasNextPage && (
        <div className="h-2 text-center text-primary mt-2">
          <button type="button" onClick={() => fetchNextPage()}>
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;