/* eslint-disable @next/next/no-img-element */
import { allBlogs } from 'contentlayer/generated'
import { ImageResponse } from 'next/og'

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export const runtime = 'edge'

const size = {
  width: 1200,
  height: 630,
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  // Font
  // const interSemiBold = fetch(new URL('./Inter-SemiBold.ttf', import.meta.url)).then((res) =>
  //   res.arrayBuffer()
  // )
  const websiteLogo = await fetch(
    new URL('../../../../../../../public/static/images/logo.png', import.meta.url)
  ).then((res) => res.arrayBuffer())
  const slug = (await params).slug
  console.log(slug)

  const post = allBlogs.find((p) => p.slug === slug.join('/'))

  let title: string, description: string, date: string

  if (!post) {
    title = 'Roitiumの自留地'
    description = 'Roitiumの自留地'
    date = ''
  } else {
    title = post.title
    description = post.summary || '还没有简介欸'
    date = new Date(post.date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
          padding: '60px',
        }}
        lang="zh-CN"
      >
        <div
          style={{
            margin: 'auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '80px',
            width: '100%',
            paddingLeft: '20px',
            paddingRight: '0px',
          }}
        >
          {/* Right Column with Logo */}
          <div style={{ display: 'flex', flex: '0 0 auto' }}>
            <img
              // just make typescript happy
              src={websiteLogo as unknown as string}
              alt="Logo"
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                objectFit: 'cover',
                transform: 'rotate(0deg)',
                transition: 'transform 0.7s ease-in-out',
              }}
            />
          </div>
          {/* Left Column with Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: '1',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 52,
                fontWeight: 700,
                color: '#1e293b',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#475569',
              }}
            >
              {description}
            </div>
            {date && (
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  color: '#64748b',
                }}
              >
                {date}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // fonts: [
      //   {
      //     name: 'Noto Sans SC',
      //     data: await loadGoogleFont('Noto Sans SC', `${title} ${description} ${date}`),
      //     style: 'normal',
      //   },
      // ],
    }
  )
}
