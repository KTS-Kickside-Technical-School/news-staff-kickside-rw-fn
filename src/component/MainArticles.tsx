import { Link } from 'react-router-dom';
import { iArticleType } from '../utils/types/Article';
import { formatDistanceToNow } from 'date-fns';

interface MainArticlesProps {
  loading: boolean;
  articles: iArticleType[];
  title: string;
}

const MainArticles = ({ loading, articles, title }: MainArticlesProps) => {
  const renderSkeleton = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="relative flex-1 w-full lg:w-[500px] lg:h-[450px] bg-gray-700 animate-pulse rounded-lg">
        <div className="w-full h-[400px] lg:h-[450px] bg-gray-600 rounded-lg"></div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="w-1/3 h-4 bg-gray-500 mb-2 rounded"></div>
          <div className="w-2/3 h-6 bg-gray-500 mb-2 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-500 rounded"></div>
        </div>
      </div>

      <div className="flex-1 w-full lg:w-[512px] lg:h-[450px] hidden lg:block bg-gray-700 animate-pulse rounded-lg">
        <div className="w-full h-[357px] bg-gray-600 rounded-lg mb-4"></div>
        <div className="px-4">
          <div className="w-1/4 h-4 bg-gray-500 mb-2 rounded"></div>
          <div className="w-3/4 h-6 bg-gray-500 mb-2 rounded"></div>
          <div className="w-1/2 h-4 bg-gray-500 rounded"></div>
        </div>
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="flex flex-col lg:flex-row gap-8">
      {articles[0] && (
        <div className="relative flex-1 w-full lg:w-[500px] lg:h-[450px]">
          <img
            src={articles[0].coverImage || ''}
            alt={articles[0].title || 'No Title'}
            className="shadow-lg w-full h-[400px] lg:h-[450px] object-cover rounded-lg"
          />
          <Link to={`/news/${articles[0].slug}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 rounded-lg">
              <span className="relative text-white text-sm font-semibold pb-5">
                <Link
                  to={`/category/${articles[0].category}`}
                  className="absolute top-[-4px] left-0 w-12 h-[2px] bg-white"
                >
                  {articles[0].category || 'Uncategorized'}
                </Link>
              </span>
              <h2 className="text-2xl font-bold mb-2">
                {articles[0].title || 'Untitled'}
              </h2>
              <p className="text-[#ACACAC] text-sm mt-2">
                <Link
                  to={`/author/${articles[0]?.author?.username}`}
                  className="hover:underline"
                >
                  By {articles[0]?.author?.firstName || 'Unknown Author'}{' '}
                  {articles[0]?.author?.lastName}
                </Link>{' '}
                ·{' '}
                {articles[0]?.createdAt
                  ? formatDistanceToNow(new Date(articles[0]?.createdAt), {
                      addSuffix: true,
                    })
                  : 'Unknown Date'}
              </p>
            </div>
          </Link>
        </div>
      )}

      {articles[1] && (
        <div className="flex-1 w-full lg:w-[512px] lg:h-[450px] hidden lg:block">
          <Link to={`/news/${articles[1].slug}`}>
            <img
              src={articles[1].coverImage || ''}
              alt={articles[1].title || 'No Title'}
              className="shadow-lg w-full h-[357px] object-cover rounded-lg mb-1"
            />
          </Link>
          <div>
            <span className="relative text-blue-400 text-sm font-semibold mb-2">
              <Link
                to={`/category/${articles[1]?.category}`}
                className="underline"
              >
                {articles[1]?.category || 'Uncategorized'}
              </Link>
            </span>
            <h2 className="text-xl text-black font-bold mb-1">
              <Link
                to={`/news/${articles[1].slug}`}
                className="hover:underline"
              >
                {articles[1]?.title || 'Untitled'}
              </Link>
            </h2>
            <p className="text-[#ACACAC] text-sm">
              <Link
                to={`/author/${articles[1]?.author?.username}`}
                className="hover:underline"
              >
                By {articles[1]?.author?.firstName || 'Unknown Author'}{' '}
                {articles[1]?.author?.lastName}
              </Link>{' '}
              ·{' '}
              {articles[1]?.createdAt &&
                formatDistanceToNow(new Date(articles[1]?.createdAt), {
                  addSuffix: true,
                })}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="text-white py-16">
      <div className="w-full px-4 mx-auto px-4">
        <h1 className="text-4xl text-[#3E60F4] font-bold mb-8">{title}</h1>
        {loading ? renderSkeleton() : renderArticles()}
      </div>
    </section>
  );
};

export default MainArticles;
