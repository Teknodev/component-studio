import { useState, useEffect, useCallback } from 'react'

export function useFileTree(folderPath: string | null) {
  const [tree, setTree] = useState<FileTreeNode[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!folderPath) {
      setTree([])
      return
    }
    setLoading(true)
    try {
      const result = await window.electronAPI.files.getFileTree(folderPath)
      setTree(result)
    } catch {
      setTree([])
    } finally {
      setLoading(false)
    }
  }, [folderPath])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!folderPath) return

    window.electronAPI.files.watchFolder(folderPath)
    const unsubscribe = window.electronAPI.files.onFileTreeUpdate((newTree) => {
      setTree(newTree)
    })

    return () => {
      unsubscribe()
      window.electronAPI.files.unwatchFolder()
    }
  }, [folderPath])

  return { tree, loading, refresh }
}
