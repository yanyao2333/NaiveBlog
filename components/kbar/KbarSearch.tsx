'use client'
import { KBarModal } from '@/components/kbar/KBarModal'
import type { Action } from 'kbar'
import { KBarProvider } from 'kbar'
import { useRouter } from 'next/navigation'
import { MDXDocument } from 'pliny/src/utils/contentlayer'
import { useEffect, useState } from 'react'
import { formatDate } from '../../utils/time'

export const KBarSearchProvider = ({ children }) => {
  const router = useRouter()
  const searchDocumentsPath = '/search.json'
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const defaultActions = []

  useEffect(() => {
    const mapPosts = (posts: MDXDocument[]) => {
      const actions: Action[] = []
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post.body.raw,
          section: 'Blog',
          subtitle: formatDate(post.date),
          perform: () => router.push('/' + post.path),
        })
      }
      return actions
    }
    async function fetchData() {
      if (searchDocumentsPath) {
        const res = await fetch(searchDocumentsPath)
        const json = await res.json()
        const actions = mapPosts(json)
        setSearchActions(actions)
        setDataLoaded(true)
      }
    }
    if (!dataLoaded && searchDocumentsPath) {
      fetchData()
    } else {
      setDataLoaded(true)
    }
  }, [dataLoaded, router, searchDocumentsPath])

  return (
    <KBarProvider actions={defaultActions}>
      <KBarModal actions={searchActions} isLoading={!dataLoaded} />
      {children}
    </KBarProvider>
  )
}
