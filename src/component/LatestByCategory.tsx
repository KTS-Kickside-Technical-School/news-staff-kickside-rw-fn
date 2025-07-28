import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { iArticleType } from '../utils/types/Article';
import { Link } from 'react-router-dom';
import MostPopular from './MostPopularArticle';

interface LatestNewsProps {
  title: string;
  articles: iArticleType[];
  loading: boolean;
}

const LatestNews: React.FC<LatestNewsProps> = ({
  title,
  articles,
  loading,
}) => {
  return (
    <div className="mx-auto mt-5">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {loading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col mb-4 border-b-2 border-[#ACACAC] pb-2 animate-pulse"
                >
                  <div className="w-full h-[200px] bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                    <div className="w-3/4 h-5 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            : articles.map((item: iArticleType, index) => (
                <Link to={`/news/${item.slug}`} key={index} className="block">
                  <div className="flex flex-col sm:flex-row mb-4 border-b-2 border-[#ACACAC] pb-2">
                    <img
                      src={item.coverImage}
                      alt="Article"
                      className="w-full sm:w-[200px] sm:h-[100px] object-cover mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/category/${item.category}`}
                        className="text-[#3E60F4] text-sm font-bold uppercase mb-2 block hover:underline"
                      >
                        {item.category || 'Uncategorized'}
                      </Link>
                      <h2 className="text-lg font-semibold text-black hover:underline">
                        {item.title}
                      </h2>
                      <p className="text-[#ACACAC] text-sm">
                        <Link
                          to={`/author/${item.author.username}`}
                          className="hover:underline text-[#3E60F4]"
                        >
                          {item.author.firstName} {item.author.lastName}
                        </Link>{' '}
                        ·{' '}
                        {formatDistanceToNow(new Date(item.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        <div
          className="lg:col-span-1 space-y-6 w-full sm:w-[300px]
        lg:w-full"
        >
          <div className="bg-[#D8D8D8] h-[200px] sm:h-[300px] lg:h-[400px] w-full  p-3 border-solid border-2 border-secondary text-center text-[#B1B1B1] flex items-center justify-center">
            <span>Advertisement</span>
          </div>
          <MostPopular />
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
