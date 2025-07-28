import { useState } from 'react';
import { FaSearch, FaTimes, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getPublishedArticles } from '../utils/requests/articlesRequest';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchArticles = async () => {
    try {
      const response = await getPublishedArticles();
      console.log(response);
      if (response.status === 200) {
        setAllArticles(response.articles);
        setHasFetched(true);
        filterArticles(search, response.data);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  const filterArticles = (value: string, sourceData?: any[]) => {
    setSearch(value);
    const source = sourceData || allArticles;

    const keywords = value
      .toLowerCase()
      .split(' ')
      .filter((word) => word.trim() !== '');

    const filtered = source.filter((article) => {
      const title = article.title?.toLowerCase() || '';
      const content = article.content?.toLowerCase() || '';

      return keywords.some(
        (keyword) => title.includes(keyword) || content.includes(keyword)
      );
    });

    setFilteredArticles(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!hasFetched) {
      setSearch(value);
      fetchArticles();
    } else {
      filterArticles(value);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="text-white py-4 bg-primary w-full">
      <div className="w-full px-4">
        <div className="text-center mb-4">
          {window.location.pathname === '/' ? (
            <button
              onClick={() => (window.location.href = '/')}
              className="mx-auto block"
            >
              <h1 className="font-bold text-2xl text-white">KICKSIDE</h1>
            </button>
          ) : (
            <Link to="/" className="mx-auto block">
              <h1 className="font-bold text-2xl text-white">KICKSIDE</h1>
            </Link>
          )}
        </div>

        <div className="bg-dark w-full p-3 rounded-lg px-5">
          {!isSearchOpen ? (
            <div className="flex justify-between items-center gap-4">
              <button
                className="text-white lg:hidden p-2 rounded-full hover:bg-gray-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <FaBars />
              </button>

              <nav className="hidden lg:flex gap-6">
                <Link to="/category/Business" className="hover:underline">
                  Business
                </Link>
                <Link to="/category/Technology" className="hover:underline">
                  Technology
                </Link>
                <Link to="/category/Sports" className="hover:underline">
                  Sports
                </Link>
                <Link to="/category/Entertainment" className="hover:underline">
                  Entertainment
                </Link>
              </nav>

              <button
                className="text-white p-2 rounded-full hover:bg-gray-600"
                onClick={() => setIsSearchOpen(true)}
              >
                <FaSearch />
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <div className="flex items-center bg-white rounded overflow-hidden shadow-md w-full">
                <input
                  type="text"
                  className="px-4 py-2 w-full text-black focus:outline-none"
                  placeholder="Search articles or topics"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button
                  className="text-black bg-gray-200 p-2 rounded-r-full hover:bg-gray-300"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearch('');
                    setFilteredArticles([]);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          onClick={closeMenu}
        >
          <div
            className="bg-dark p-6 rounded-lg shadow-lg w-[80%] sm:w-[60%] md:w-[40%] lg:w-[30%]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="text-white p-2 rounded-full hover:bg-gray-600 mb-4"
              onClick={closeMenu}
            >
              <FaTimes />
            </button>
            <nav>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link to="/category/Business" className="hover:underline">
                    Business
                  </Link>
                </li>
                <li>
                  <Link to="/category/Technology" className="hover:underline">
                    Technology
                  </Link>
                </li>
                <li>
                  <Link to="/category/Sports" className="hover:underline">
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/Entertainment"
                    className="hover:underline"
                  >
                    Entertainment
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {isSearchOpen && search && (
        <div className="w-full px-4">
          <div className="bg-white text-black p-4 my-2 rounded-md shadow-md">
            <ul>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <li className="py-2 border-b last:border-b-0">
                    <a
                      href={`/news/${article.slug}`}
                      className="hover:underline"
                    >
                      {article.title}
                    </a>
                  </li>
                ))
              ) : (
                <li>No articles found.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
