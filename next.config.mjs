/** @type {boolean} */
const isStaticExport = true;

const parseRemotePatterns = (patterns) => {
  if (!patterns || isStaticExport) {
    console.log('isStaticExport:', isStaticExport);
    return undefined;
  }

  const patternList = patterns.split(',');
  return patternList.map(pattern => {
    pattern = pattern.trim();
    if (pattern.startsWith('http://') || pattern.startsWith('https://')) {
      const url = new URL(pattern);
      return {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname
      };
    }

    return {
      protocol: 'http',
      hostname: pattern
    };
  });
};

const remotePatterns = parseRemotePatterns(process.env.NEXT_PUBLIC_REMOTE_PATTERNS);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: isStaticExport,
    remotePatterns: remotePatterns
  },
  optimizeFonts: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_REMOTE_PATTERNS: process.env.NEXT_PUBLIC_REMOTE_PATTERNS || '',
    API_URL: process.env.NEXT_PUBLIC_API_URL || ''
  }
};

export default nextConfig;
