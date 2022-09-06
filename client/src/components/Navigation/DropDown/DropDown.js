import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const DropDown = ({ anchorEl, open, onClose, children }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    /**
     * Called if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !anchorEl?.contains(event.target)
      ) {
        onClose();
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, onClose, anchorEl]);

  return (
    <div
      className={`absolute bg-surface text-on-surface border border-on-surface/20 shadow-[0px_0px_15px] shadow-on-surface/20 transition-all ${
        open
          ? 'bottom-[120%] opacity-100 visible'
          : 'bottom-0 opacity-0 invisible'
      } left-1/2 -translate-x-1/2 rounded-md min-w-full`}
      ref={containerRef}
    >
      <ul>{children}</ul>
    </div>
  );
};

DropDown.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

DropDown.defaultProps = {
  anchorEl: null,
};

export default DropDown;