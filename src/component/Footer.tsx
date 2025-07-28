import Logo from '/logo.svg';
import { Link } from 'react-router-dom';
import { BsInstagram, BsLinkedin, BsYoutube, BsTwitterX } from 'react-icons/bs';
import { BiCopyright } from 'react-icons/bi';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-6 flex flex-col items-center gap-6">
      <div className="w-80% flex flex-col md:flex-row md:justify-between items-center gap-4 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" width={30} />
          <span className="text-lg font-semibold">Kickside Rw.</span>
        </Link>

        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <Link
              to="/login"
              aria-label="Staff"
              className="font-bold hover:underline"
            >
              Staff
            </Link>
          </li>
          <li>
            <Link to="/contactus" className="font-bold hover:underline">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="https://www.instagram.com/kickside_rw/"
          target="_blank"
          aria-label="Instagram"
          className="hover:text-gray-300"
        >
          <BsInstagram size={24} />
        </Link>
        <Link
          to="https://www.youtube.com/@KicKSideRw"
          target="_blank"
          aria-label="YouTube"
          className="hover:text-gray-300"
        >
          <BsYoutube size={24} />
        </Link>
        <Link
          to="https://www.linkedin.com/company/kickside-rwanda/?viewAsMember=true"
          target="_blank"
          aria-label="LinkedIn"
          className="hover:text-gray-300"
        >
          <BsLinkedin size={24} />
        </Link>
        <Link
          to="https://x.com/KickSide_RW"
          target="_blank"
          aria-label="Twitter"
          className="hover:text-gray-300"
        >
          <BsTwitterX size={24} />
        </Link>
      </div>

      <div className="text-center">
        <p className="flex items-center justify-center gap-2">
          <BiCopyright size={16} />
          2023 - {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
