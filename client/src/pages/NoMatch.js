import { Link, useMatch } from 'react-router-dom';

const NoMatch = () => {
  const match = useMatch('/messages/:chatId');
  if (match) return null;
  return (
    <div className="text-center h-full flex flex-col justify-center items-center bg-background">
      <h1 className="text-4xl text-primary">Page not found</h1>
      <h2 className="text-lg font-normal my-4 mx-0 text-on-background">
        Uh-oh! Looks like the page you are trying to access doesn&apos;t exist.
        Please start afresh.
      </h2>
      <Link
        to="/home"
        className="inline-block no-underline bg-primary text-on-primary font-source-sans-pro text-base font-bold py-3 px-5 border border-transparent transition-all cursor-pointer hover:bg-transparent hover:text-primary hover:border-primary"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NoMatch;
