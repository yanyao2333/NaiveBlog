'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

// 已废弃，直接加载评论组件
export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  console.log(siteMetadata.comments)
  return (
    <>
      {loadComments ? (
        <CommentsComponent
          commentsConfig={siteMetadata.comments}
          slug={slug}
        />
      ) : (
        <button onClick={() => setLoadComments(true)}>Load Comments</button>
      )}
    </>
  )
}
