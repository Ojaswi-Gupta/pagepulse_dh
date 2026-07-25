const axios = require('axios');
const cheerio = require('cheerio');

async function auditUrl(url) {
  try {
    // Validate URL format
    new URL(url);
  } catch (error) {
    throw new Error('Invalid URL format');
  }

  const startTime = performance.now();
  let response;

  try {
    response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PagePulseBot/1.0)'
      }
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Request timed out');
    }
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }

  const endTime = performance.now();
  const responseTime = Math.round(endTime - startTime);

  const contentType = response.headers['content-type'] || '';
  if (!contentType.includes('text/html')) {
    throw new Error('Non-HTML response received');
  }

  const html = response.data;
  const $ = cheerio.load(html);

  const title = $('title').text().trim() || 'No title found';
  const metaDescription = $('meta[name="description"]').attr('content') || 'No meta description found';
  const h1Count = $('h1').length;
  
  let imagesMissingAlt = 0;
  $('img').each((i, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt.trim() === '') {
      imagesMissingAlt++;
    }
  });

  // Approximate word count
  $('script, style, noscript, iframe').remove();
  const bodyText = $('body').text();
  const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;

  return {
    status: response.status,
    responseTime: `${responseTime}ms`,
    title,
    metaDescription,
    h1Count,
    imagesMissingAlt,
    wordCount
  };
}

module.exports = { auditUrl };
