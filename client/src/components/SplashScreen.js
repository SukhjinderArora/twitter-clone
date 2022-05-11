import { IconContext } from 'react-icons';
import { RiShareLine } from 'react-icons/ri';

const SplashScreen = () => {
  return (
    <div className="bg-background text-on-background fixed top-0 left-0 h-full w-full z-[999]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-primary">
          <IconContext.Provider
            // eslint-disable-next-line react/jsx-no-constructed-context-values
            value={{
              size: '72px',
              color: 'inherit',
            }}
          >
            <RiShareLine />
          </IconContext.Provider>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
