import { withContentCollections } from '@content-collections/next'
import withBundleAnalyzer from '@next/bundle-analyzer'

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is openpanel.dev vercel.live va.vercel-scripts.com unpkg.com;
  style-src 'self' https://vercel.live 'unsafe-inline';
  img-src * blob: data: https://vercel.live https://vercel.com;
  media-src *.s3.amazonaws.com;
  connect-src *;
  font-src 'self' https://vercel.live https://assets.vercel.com;
  frame-src giscus.app vercel.live;

`

const securityHeaders = [
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
	{
		key: 'Content-Security-Policy',
		value: ContentSecurityPolicy.replace(/\n/g, ''),
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
	{
		key: 'Referrer-Policy',
		value: 'strict-origin-when-cross-origin',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
	{
		key: 'X-Frame-Options',
		value: 'DENY',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
	{
		key: 'X-DNS-Prefetch-Control',
		value: 'on',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=31536000; includeSubDomains',
	},
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=()',
	},
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import("next").NextConfig}
 **/
const nextConfig = {
	output,
	basePath,
	reactStrictMode: true,
	pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
	eslint: {
		dirs: ['app', 'components', 'layouts', 'scripts'],
	},
	experimental: {
		viewTransition: true,
		reactCompiler: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
			{
				protocol: 'https',
				hostname: 'secure.gravatar.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.jsdelivr.net',
			},
		],
		unoptimized,
	},
	headers: async () => {
		return [
			{
				source: '/(.*)',
				headers: securityHeaders,
			},
		]
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	webpack: (config, _) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})
		// config.resolve.alias['./locale'] = 'moment/locale'
		return config
	},
}
const withBundleAnalyzerConfig = withBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})
// const config = withContentlayer(withBundleAnalyzerConfig(nextConfig))

// const config = MillionLint.next({ rsc: true })(
//   withBundleAnalyzerConfig(nextConfig),
// )

export default withContentCollections(withBundleAnalyzerConfig(nextConfig))
