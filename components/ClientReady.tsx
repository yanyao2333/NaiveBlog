'use client'

import { useEffect } from 'react'

export default function ClientReady() {
  useEffect(() => {
    console.log(
      '\n %c Naive Blog %c https://github.com/yanyao2333/NaiveBlog',
      'color:#fff;background:linear-gradient(90deg,#448bff,#44e9ff);padding:5px 0;',
      'color:#000;background:linear-gradient(90deg,#44e9ff,#ffffff);padding:5px 10px 5px 0px;'
    )
  })
  return null
}
