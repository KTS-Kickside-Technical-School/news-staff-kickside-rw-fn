import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { Readable } from 'stream';

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/category/Technology', changefreq: 'weekly', priority: 0.8 },
  { url: '/category/Business', changefreq: 'weekly', priority: 0.8 },
  { url: '/category/Entertainment', changefreq: 'weekly', priority: 0.8 },
  { url: '/category/Sports', changefreq: 'weekly', priority: 0.8 },
  { url: '/contactus', changefreq: 'weekly', priority: 0.8 },
];

const hostname = 'https://www.kickside.rw';

const stream = new SitemapStream({ hostname });

streamToPromise(Readable.from(links).pipe(stream))
  .then((data) => {
    const file = createWriteStream('public/sitemap.xml');
    file.write(data.toString());
    file.end();
    console.log('✅ sitemap.xml generated.');
  })
  .catch((err) => {
    console.error('❌ Failed to generate sitemap:', err);
  });
