import React from 'react';
import { Link } from 'react-router-dom';
import AdvertisementSection from './AdvertisementSection';
import { iArticleType } from '../utils/types/Article';
import { formatDistanceToNow } from 'date-fns';

interface SubMainArticlesProps {
  title?: string;
  articles: iArticleType[];
  loading: boolean;
}

const SubMainArticles: React.FC<SubMainArticlesProps> = ({
  title,
  articles,
  loading,
}) => {
  return (
    <div className="mt-0">
      {title && <h1 className="text-2xl font-bold mb-2 text-dark">{title}</h1>}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  className="p-3 bg-gray-200 rounded shadow-md animate-pulse"
                  key={index}
                >
                  <div className="h-36 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-400 rounded mb-1"></div>
                  <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                </div>
              ))
            : articles.map((article: iArticleType, index) => (
                <div className="p-3" key={index}>
                  <div>
                    <Link
                      to={`/category/${article.category}`}
                      className="relative text-[#3E60F4] text-sm font-semibold mb-2 hover:underline"
                    >
                      <span className="absolute top-[-4px] left-0 w-12 h-[2px] bg-[#3E60F4]"></span>
                      {article.category || 'Uncategorized'}
                    </Link>

                    <Link to={`/news/${article.slug}`}>
                      <h3 className="text-sm font-bold text-black mb-2 hover:underline">
                        {article.title || 'Untitled'}
                      </h3>
                    </Link>

                    <p className="text-[#ACACAC] text-sm mt-2">
                      <Link
                        to={`/author/${article.author?.username}`}
                        className="hover:underline text-[#ACACAC]"
                      >
                        {article.author?.firstName} {article.author?.lastName}
                      </Link>
                      ·{' '}
                      {formatDistanceToNow(new Date(article?.createdAt), {
                        addSuffix: true,
                      })}{' '}
                    </p>
                  </div>
                </div>
              ))}
        </div>

        <div className="w-full px-4 col-span-1 text-gray-400">
          <AdvertisementSection />
        </div>
      </div>
    </div>
  );
};

export default SubMainArticles;
