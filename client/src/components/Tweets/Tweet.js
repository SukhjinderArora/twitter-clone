/* eslint-disable react/jsx-no-constructed-context-values */
import { IconContext } from 'react-icons';
import {
  RiChat1Line,
  RiRepeatLine,
  RiHeartLine,
  RiShareLine,
} from 'react-icons/ri';

const Tweet = () => {
  return (
    <article className="flex justify-between gap-3 bg-surface text-on-surface px-3 py-2 mb-4 border-b border-on-surface/30">
      <div className="h-10 w-10 overflow-hidden">
        <img
          className="h-full w-full rounded-full object-cover"
          src="https://i.pravatar.cc/300"
          alt="avatar"
        />
      </div>
      <div className="flex-1">
        <div className="flex">
          <h3 className="font-semibold text-sm mr-2">Sukhjinder Arora</h3>
          <span className="font-light text-sm text-on-surface/90 font-source-sans-pro to mr-2">
            @sukhjinder_arora
          </span>
          <span className="font-light text-sm text-on-surface/90 font-lato">
            1m
          </span>
        </div>
        <div className="my-2">
          <p className="text-sm text-semibold font-source-sans-pro">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, sed
            tempora quae reiciendis quia laboriosam ratione placeat consequatur
            consectetur, doloremque reprehenderit repellat laborum, eveniet
            impedit aut in. Pariatur, consequuntur temporibus?
          </p>
        </div>
        <div className="flex justify-between text-on-surface/40">
          <div>
            <IconContext.Provider
              value={{
                size: '14px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiChat1Line />
            </IconContext.Provider>
          </div>
          <div>
            <IconContext.Provider
              value={{
                size: '14px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiRepeatLine />
            </IconContext.Provider>
          </div>
          <div>
            <IconContext.Provider
              value={{
                size: '14px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiHeartLine />
            </IconContext.Provider>
          </div>
          <div>
            <IconContext.Provider
              value={{
                size: '14px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiShareLine />
            </IconContext.Provider>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Tweet;
