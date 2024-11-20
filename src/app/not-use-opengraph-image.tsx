/* eslint-disable @next/next/no-img-element */
import siteMetadata from '@/data/siteMetadata'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Roitiumの自留地'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// 不导出，使用静态的 og 图片
async function Image() {
  // Font
  // const interSemiBold = fetch(new URL('./Inter-SemiBold.ttf', import.meta.url)).then((res) =>
  //   res.arrayBuffer()
  // )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#f0f0f3',
          padding: '60px',
        }}
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
          }}
        >
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
                fontSize: 72,
                fontWeight: 'bold',
                color: '#1e293b',
                lineHeight: 1.2,
              }}
            >
              {siteMetadata.title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                color: '#475569',
              }}
            >
              {siteMetadata.description}
            </div>
          </div>

          {/* Right Column with Logo */}
          <div style={{ display: 'flex', flex: '0 0 auto' }}>
            <img
              src={
                'https://cdn.jsdelivr.net/gh/yanyao2333/NaiveBlog@main/public/static/images/logo.png'
              }
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
        </div>
      </div>
    ),
    {
      ...size,
      // fonts: [
      //   {
      //     name: 'Inter',
      //     data: await interSemiBold,
      //     style: 'normal',
      //     weight: 600,
      //   },
      // ],
    }
  )
}
