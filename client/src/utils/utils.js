const checkIfEmpty = (obj) => {
  if (obj && Object.keys(obj).length === 0) {
    return true;
  }
  return false;
};

const setAllObjectProperties = (obj, value) => {
  const newObj = Object.keys(obj).reduce((acc, cur) => {
    acc[cur] = value;
    return acc;
  }, {});
  return newObj;
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    try {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject(new Error(`Failed to load the script ${src}`));
      };
      document.body.appendChild(script);
    } catch (error) {
      reject(error);
    }
  });
};

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

export { checkIfEmpty, setAllObjectProperties, loadScript, STATUS };
