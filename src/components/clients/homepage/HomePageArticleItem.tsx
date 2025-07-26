import React from "react";
import { Link } from "react-router-dom";

const HomePageArticleItem = React.memo(({ article }: { article: any }) => (
  <Link to={`/news/${article?.slug}`} className="block w-full">
    <div className="relative h-[300px] md:h-[350px] lg:h-[250px] xl:h-[200px] overflow-hidden rounded-md">
      <img
        src={article?.coverImage || ''}
        srcSet={`${article?.coverImage} 300w, ${article?.coverImage} 600w`}
        sizes="(max-width: 768px) 100vw, 33vw"
        loading="lazy"
        alt={article?.title || ''}
        width={600}
        height={400}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
      <div className="relative z-20 flex flex-col justify-end h-full p-4">
        <Link
          to={`category/${article?.category}`}
          className="border-t-2 border-white text-white font-bold text-xs md:text-sm"
        >
          {article?.category}
        </Link>
        <Link
          to={`/news/${article?.slug}`}
          className="text-white line-clamp-2 mt-2 text-sm md:text-base"
        >
          {article?.title}
        </Link>
      </div>
    </div>
  </Link>
));


export default HomePageArticleItem