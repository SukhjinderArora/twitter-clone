import { Outlet } from 'react-router-dom';
import Header from '../components/mobile/Header';

const Messages = () => {
  return (
    <div className="flex">
      <div className="static top-0 overflow-y-auto overflow-x-hidden h-[calc(100vh_-_56px)] flex-1">
        <div className="sticky top-0 left-0 w-full">
          <Header pageTitle="Messages" />
        </div>
        <div>
          <div className="flex px-4 py-2 items-center gap-1 border-b border-on-surface/30">
            <div className="h-10 w-10 overflow-hidden">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://i.pravatar.cc/300"
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-1 items-center">
                  <h3 className="font-bold text-on-surface">Jimmy</h3>
                  <span className="text-on-surface/70 font-semibold text-sm">
                    @jimmy024
                  </span>
                </div>
                <span className="text-on-surface/70">1d</span>
              </div>
              <p className="text-on-surface/80 font-medium">
                Can you help me with this?
              </p>
            </div>
          </div>
          <div className="flex px-4 py-2 items-center gap-1 border-b border-on-surface/30">
            <div className="h-10 w-10 overflow-hidden">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://i.pravatar.cc/300"
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-1 items-center">
                  <h3 className="font-bold text-on-surface">Peter</h3>
                  <span className="text-on-surface/70 font-semibold text-sm">
                    @pete024
                  </span>
                </div>
                <span className="text-on-surface/70">1d</span>
              </div>
              <p className="text-on-surface/80 font-medium">
                You: Are you coming?
              </p>
            </div>
          </div>
          <div className="flex px-4 py-2 items-center gap-1">
            <div className="h-10 w-10 overflow-hidden">
              <img
                className="h-full w-full rounded-full object-cover"
                src="https://i.pravatar.cc/300"
                alt="avatar"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div className="flex gap-1 items-center">
                  <h3 className="font-bold text-on-surface">Mike</h3>
                  <span className="text-on-surface/70 font-semibold text-sm">
                    @mike024
                  </span>
                </div>
                <span className="text-on-surface/70">1d</span>
              </div>
              <div className="flex justify-between">
                <p className="text-on-surface/80 font-semibold">
                  You going to the party?
                </p>
                <div className="bg-primary w-5 h-5 flex items-center justify-center p-3 rounded-full">
                  <span className="text-on-primary text-xs font-semibold">
                    5
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 empty:hidden static top-0 overflow-y-auto overflow-x-hidden h-[calc(100vh_-_56px)]">
        <Outlet />
      </div>
    </div>
  );
};

export default Messages;
