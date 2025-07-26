import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RelatedArticles = ({ title, articles, seeMore = false }: any) => {
  return (
    <div className="pb-3 mb-3 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        {seeMore !== false && (
          <Link
            to="/articles"
            className="inline-block px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            See More
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 &&
          articles.slice(0, 3).map((article: any) => (
            <Link
              to={`/news/${article.slug}`}
              className="bg-white shadow-md overflow-hidden transition-transform transform hover:scale-105"
            >
              <img
                className="w-full h-56 object-cover"
                src={article.coverImage}
                alt={`Image of ${article.title}`}
              />
              <div className="p-4">
                <Link
                  to={`/category/${article.category}`}
                  className="text-sm text-blue-600 font-semibold uppercase"
                >
                  {article.category}
                </Link>
                <Link
                  to={`/news/${article.slug}`}
                  className="block text-lg text-gray-900 font-medium my-2 line-clamp-2"
                >
                  {article.title}
                </Link>
                <p className="text-sm text-gray-400">
                  <Link
                    to={`/author/${article.author.username}`}
                    className=" hover:underline"
                  >
                    {article.author.firstName} {article.author.lastName}
                  </Link>{' '}
                  -{' '}
                  <span>
                    {article?.createdAt &&
                      formatDistanceToNow(new Date(article?.createdAt), {
                        addSuffix: true,
                      })}
                  </span>
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default RelatedArticles;
