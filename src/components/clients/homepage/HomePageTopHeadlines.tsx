import React from 'react';
import { Link } from 'react-router-dom';

const HomepageTopHeadlines = React.memo(({ articles }: { articles: any[] }) => (
  <ol className="space-y-3">
    {articles.map((article, index) => (
      <li
        className="text-white text-sm md:text-base font-medium flex"
        key={article?._id}
      >
        <strong className="mr-2">{index + 1}.</strong>
        <Link
          to={`/news/${article?.slug}`}
          className="hover:text-gray-200 transition"
        >
          {article?.title}
        </Link>
      </li>
    ))}
  </ol>
));

export default HomepageTopHeadlines;
