/* eslint-disable react/jsx-no-constructed-context-values */
import { RiSendPlane2Line } from 'react-icons/ri';
import { IconContext } from 'react-icons';

const Chat = () => {
  return (
    <div>
      <div className="messages p-4">
        <div className="sentMessage flex flex-col items-end gap-1 mb-5">
          <p className="bg-primary text-on-primary text-base p-3 rounded-t-xl rounded-bl-xl max-w-[80%]">
            Lorem ipsum dolor?
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
        <div className="sentMessage flex flex-col items-end gap-1 mb-5">
          <p className="bg-primary text-on-primary text-base p-3 rounded-t-xl rounded-bl-xl max-w-[80%]">
            Lorem ipsum dolor sit amet
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
        <div className="receivedMessage flex flex-col items-start gap-1 mb-5">
          <p className="bg-on-surface/30 text-on-surface text-base p-3 rounded-t-xl rounded-br-xl max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
            sapiente?
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
        <div className="receivedMessage flex flex-col items-start gap-1 mb-5">
          <p className="bg-on-surface/30 text-on-surface text-base p-3 rounded-t-xl rounded-br-xl max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
            sapiente?
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
        <div className="sentMessage flex flex-col items-end gap-1 mb-5">
          <p className="bg-primary text-on-primary text-base p-3 rounded-t-xl rounded-bl-xl max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
            sapiente?
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
        <div className="receivedMessage flex flex-col items-start gap-1 mb-5">
          <p className="bg-on-surface/30 text-on-surface text-base p-3 rounded-t-xl rounded-br-xl max-w-[80%]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
            sapiente? Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Illum, nostrum! Cupiditate et sapiente alias illum commodi expedita
            doloremque nobis adipisci?
          </p>
          <span className="text-on-surface/40 font-light text-xs">
            Jul 26, 2020, 11:37 AM
          </span>
        </div>
      </div>
      <div className="sticky bottom-0 left-0 w-full">
        <form className="flex justify-evenly items-center border-t border-on-surface/30 pt-2 bg-surface">
          <div className="relative w-[80%]">
            <textarea
              name="message"
              id="message"
              className="bg-surface text-on-surface border border-on-surface/30 w-[100%] rounded-3xl px-4 py-3 text-sm peer outline-none focus:border-primary"
              placeholder="Send new message"
              rows="1"
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
