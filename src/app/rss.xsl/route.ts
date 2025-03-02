const xsl = `<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
        <head>
            <title>
                RSS Feed |
                <xsl:value-of select="/rss/channel/title"/>
            </title>
            <meta charset="utf-8"/>
            <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <style>
                body {
                    font-family: sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background-color: #f9fafb;
                    color: #374151;
                }
                main {
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    max-width: 768px;
                    padding: 1rem;
                }
                a {
                    color: #2563eb;
                    text-decoration: none;
                }
                a:hover {
                    text-decoration: underline;
                }
                h1 {
                  font-size: 2em;
                  font-weight: bold;
                  margin-bottom: 1rem;
                  display: flex;
                  align-items: flex-start;
                }
                h2 {
                  font-size: 1.5em;
                  font-weight: bold;
                  margin-bottom: 1rem;
                }
                .alert-box {
                    padding: 1rem;
                    background-color: #e0f2fe;
                    border-radius: 0.375rem;
                    color: #0369a1;
                    margin-bottom: 1rem;
                }
                .alert-box strong {
                    font-weight: bold;
                }
                .feed-icon {
                    margin-right: 1.25rem;
                    shrink: 0;
                    width: 1em;
                    height: 1em;
                }
                .post-item {
                    padding-bottom: 1.75rem;
                }
                .post-item a {
                  font-size: 1.125rem;
                  font-weight: bold;
                }

                .published-date {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                .content-area {
                    padding-top: 1.75rem;
                    padding-bottom: 1.75rem;
                }
            </style>
        </head>
        <body>
            <main>
                <div class="alert-box">
                    <strong>这是一个 RSS Feed 链接</strong>。把这个链接添加到你的 RSS 阅读器中来订阅我的博客。访问 <a
                    href="https://aboutfeeds.com">About Feeds
                    </a>来了解更多有关 RSS 的信息。
                </div>
                <div class="content-area">
                    <h1 >
                        <!-- https://commons.wikimedia.org/wiki/File:Feed-icon.svg -->
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
                             class="feed-icon"
                             viewBox="0 0 256 256">
                            <defs>
                                <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915"
                                                id="RSSg">
                                    <stop offset="0.0" stop-color="#E3702D"/>
                                    <stop offset="0.1071" stop-color="#EA7D31"/>
                                    <stop offset="0.3503" stop-color="#F69537"/>
                                    <stop offset="0.5" stop-color="#FB9E3A"/>
                                    <stop offset="0.7016" stop-color="#EA7C31"/>
                                    <stop offset="0.8866" stop-color="#DE642B"/>
                                    <stop offset="1.0" stop-color="#D95B29"/>
                                </linearGradient>
                            </defs>
                            <rect width="256" height="256" rx="55" ry="55" x="0" y="0"
                                  fill="#CC5D15"/>
                            <rect width="246" height="246" rx="50" ry="50" x="5" y="5"
                                  fill="#F49C52"/>
                            <rect width="236" height="236" rx="47" ry="47" x="10" y="10"
                                  fill="url(#RSSg)"/>
                            <circle cx="68" cy="189" r="24" fill="#FFF"/>
                            <path
                                    d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z"
                                    fill="#FFF"/>
                            <path
                                    d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z"
                                    fill="#FFF"/>
                        </svg>
                        RSS Feed 预览
                    </h1>
                    <h2>
                        <xsl:value-of select="/rss/channel/title"/>
                    </h2>
                    <p>
                        <xsl:value-of select="/rss/channel/description"/>
                    </p>
                    <a>
                        <xsl:attribute name="href">
                            <xsl:value-of select="/rss/channel/link"/>
                        </xsl:attribute>
                        访问网站 &#x2192;
                    </a>

                    <h2>最近文章</h2>
                    <xsl:for-each select="/rss/channel/item">
                        <div class="post-item">
                            <div class="published-date">
                                发布于
                                <xsl:value-of select="pubDate"/>
                            </div>
                            
                                <a>
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="link"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="title"/>
                                </a>
                            
                        </div>
                    </xsl:for-each>
                </div>
            </main>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>

`

export function GET() {
  return new Response(xsl, {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
