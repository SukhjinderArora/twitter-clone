import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const User = ({ user }) => {
  return (
    <Link to={`/${user.username}`}>
      <div className="flex gap-3 px-3 my-4">
        <div className="h-10 w-10 overflow-hidden">
          <img
            className="h-full w-full rounded-full object-cover"
            src={user.profile.img}
            alt="user avatar"
          />
        </div>
        <div>
          <div>
            <h2 className="font-semibold text-sm mr-2 text-on-surface">
              {user.profile.name}
            </h2>
          </div>
          <div>
            <h4 className="font-light text-sm text-on-surface/70 font-source-sans-pro to mr-2">
              @{user.username}
            </h4>
          </div>
        </div>
      </div>
    </Link>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    profile: PropTypes.shape({
      name: PropTypes.string,
      img: PropTypes.string,
    }),
  }).isRequired,
};

export default User;
