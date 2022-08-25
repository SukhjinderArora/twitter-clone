import PropTypes from 'prop-types';

const CircularProgressBar = ({
  size,
  progress,
  trackWidth,
  indicatorWidth,
}) => {
  const center = size / 2;
  const radius =
    center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);

  return (
    <svg width={size} height={size} viewBox={viewBox}>
      <circle
        className="fill-transparent stroke-primary/40"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={`${trackWidth}px`}
      />
      <circle
        className="fill-transparent stroke-primary"
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={`${indicatorWidth}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${center} ${center})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
    </svg>
  );
};

CircularProgressBar.propTypes = {
  size: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  trackWidth: PropTypes.number.isRequired,
  indicatorWidth: PropTypes.number.isRequired,
};

export default CircularProgressBar;
