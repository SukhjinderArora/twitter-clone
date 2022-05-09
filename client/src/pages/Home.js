import Header from '../components/mobile/Header';
import TweetsList from '../components/Tweets/TweetsList';

const Home = () => {
  return (
    <div className="bg-background relative">
      <div className="fixed top-0 left-0 w-full">
        <Header />
      </div>
      <div className="mt-14">
        <TweetsList />
      </div>
    </div>
  );
};

export default Home;
