const axios = require('axios');
const cheerio = require('cheerio');

// Fetch OG metadata from URL
exports.fetchOGMetadata = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    let validatedUrl;
    try {
      validatedUrl = new URL(url).toString();
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the webpage
    const response = await axios.get(validatedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract OG metadata
    const metadata = {
      title: '',
      description: '',
      image: '',
      siteName: '',
      url: validatedUrl
    };

    // OG Title
    metadata.title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    // OG Description
    metadata.description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // OG Image
    let ogImage = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      '';
    
    // Convert relative image URLs to absolute
    if (ogImage && !ogImage.startsWith('http')) {
      try {
        const baseUrl = new URL(validatedUrl);
        if (ogImage.startsWith('/')) {
          ogImage = `${baseUrl.protocol}//${baseUrl.host}${ogImage}`;
        } else {
          ogImage = new URL(ogImage, validatedUrl).toString();
        }
      } catch {
        // Keep original if conversion fails
      }
    }
    metadata.image = ogImage;

    // OG Site Name
    metadata.siteName = 
      $('meta[property="og:site_name"]').attr('content') ||
      new URL(validatedUrl).hostname.replace('www.', '') ||
      '';

    // Fallback: Try to find any large image if no OG image
    if (!metadata.image) {
      const images = $('img').map((_, el) => $(el).attr('src')).get();
      const largeImage = images.find(src => {
        if (!src) return false;
        const lower = src.toLowerCase();
        return lower.includes('hero') || 
               lower.includes('banner') || 
               lower.includes('featured') ||
               lower.includes('og-image');
      });
      if (largeImage) {
        try {
          metadata.image = new URL(largeImage, validatedUrl).toString();
        } catch {
          metadata.image = largeImage;
        }
      }
    }

    res.json({
      success: true,
      metadata
    });

  } catch (error) {
    console.error('Error fetching OG metadata:', error.message);
    res.status(500).json({
      error: 'Failed to fetch metadata',
      message: error.message
    });
  }
};
