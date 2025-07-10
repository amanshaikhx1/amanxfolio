// app/sitemap.xml/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://amanxfolio.in';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/skills',
    '/resume',
    '/portfolio',
    '/blog',
    '/contact',
  ];

  const urls = staticPages.map((page) => {
    return `
      <url>
        <loc>${baseUrl}${page}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.join('\n')}
    </urlset>
  `.trim();

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
