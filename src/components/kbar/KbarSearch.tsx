'use client'
import { KBarModal } from '@/components/kbar/KBarModal'
import type { Post } from '@/services/content/core'
import { formatDate } from '@/utils/time'
import type { Action } from 'kbar'
import { KBarProvider } from 'kbar'
// @ts-ignore
import { useRouter } from 'nextjs-toploader/app'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const KBarSearchProvider = ({ children }) => {
  const router = useRouter()
  const searchDocumentsPath = '/search.json'
  const [searchActions, setSearchActions] = useState<Action[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const defaultActions = useMemo(() => [], [])

  const mapPosts = useCallback(
    (posts: Post[]) => {
      const actions: Action[] = []
      for (const post of posts) {
        actions.push({
          id: post.path,
          name: post.title,
          keywords: post.content,
          section: 'Blog',
          subtitle: formatDate(post.date),
          perform: () => router.push(`/${post.path}`),
        })
      }
      return actions
    },
    [router],
  )

  useEffect(() => {
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
    }
  }, [mapPosts, dataLoaded])

  const memoizedProvider = useMemo(
    () => (
      <KBarProvider actions={defaultActions}>
        <KBarModal
          actions={searchActions}
          isLoading={!dataLoaded}
        />
        {children}
      </KBarProvider>
    ),
    [defaultActions, searchActions, dataLoaded, children],
  )

  return memoizedProvider
}
