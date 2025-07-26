import { motion } from 'framer-motion';

const MainTopKSAd = () => {
  return (
    <motion.a
      href="https://shop.kickside.rw"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="block w-full bg-white text-black shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 gap-4 overflow-hidden">
        <div className="flex items-center gap-4">
          <img
            src="/logo.svg"
            alt="Kickside Shop Logo"
            className="w-14 h-14 object-contain"
          />
          <div className="overflow-hidden">
            <motion.h2
              className="text-lg md:text-xl font-bold text-emerald-600 uppercase"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💸 Kickside Shop Mega Deals!
            </motion.h2>
            <motion.p
              className="text-sm md:text-base text-gray-800 font-semibold"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              Save up to{' '}
              <span className="text-emerald-600 font-extrabold">50%</span> on
              electronics, fashion & more – Today Only!
            </motion.p>
          </div>
        </div>

        <motion.div
          whileHover={{
            scale: 1.1,
            boxShadow: '0px 0px 15px rgba(5, 150, 105, 0.5)', // emerald-600 glow
          }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 text-white font-semibold px-5 py-2 uppercase tracking-wide text-sm md:text-base hover:bg-emerald-700 transition"
        >
          Shop Now →
        </motion.div>
      </div>

      <div className="w-full h-1 bg-emerald-600 animate-pulse"></div>
    </motion.a>
  );
};

export default MainTopKSAd;
