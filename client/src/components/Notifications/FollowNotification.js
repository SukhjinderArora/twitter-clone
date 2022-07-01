import { RiUserFill } from 'react-icons/ri';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const FollowNotification = ({ notification }) => {
  return (
    <div>
      <div
        className={`${
          notification.read ? 'bg-surface' : 'bg-primary/10'
        } flex p-5 gap-3 items-center border-b border-on-surface/30`}
      >
        <div className="text-primary">
          <IconContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
              color: 'inherit',
              size: '16px',
            }}
          >
            <RiUserFill />
          </IconContext.Provider>
        </div>
        <div className="text-on-surface">
          <Link className="font-bold" to={`/${notification.sender.username}`}>
            {notification.sender.profile.name}
          </Link>{' '}
          followed you
        </div>
      </div>
    </div>
  );
};

FollowNotification.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    read: PropTypes.bool.isRequired,
    sender: PropTypes.shape({
      username: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};

export default FollowNotification;
