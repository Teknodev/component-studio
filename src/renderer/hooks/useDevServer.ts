import { useState, useCallback, useEffect, useRef } from 'react'

export function useDevServer() {
  const [port, setPort] = useState<number | null>(null)
  const [starting, setStarting] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const activeRef = useRef(false)
  const currentDirRef = useRef<string | null>(null)
  const opIdRef = useRef(0)

  useEffect(() => {
    const unsubscribe = window.electronAPI.devServer.onLog((log) => {
      setLogs((prev) => [...prev.slice(-200), log])
    })
    return unsubscribe
  }, [])

  const start = useCallback(async (componentDir: string, componentEntry: string) => {
    const id = ++opIdRef.current
    const isNewServer = !activeRef.current || currentDirRef.current !== componentDir

    if (isNewServer) {
      setStarting(true)
      setPort(null)
      setLogs([])
    }

    try {
      const result = await window.electronAPI.devServer.start({ componentDir, componentEntry })
      if (id !== opIdRef.current) return
      setPort(result.port)
      activeRef.current = true
      currentDirRef.current = componentDir
    } catch (err) {
      if (id !== opIdRef.current) return
      setPort(null)
      activeRef.current = false
      currentDirRef.current = null
      throw err
    } finally {
      if (id === opIdRef.current) {
        setStarting(false)
      }
    }
  }, [])

  const selectComponent = useCallback(async (componentEntry: string) => {
    await window.electronAPI.devServer.selectComponent(componentEntry)
  }, [])

  const stop = useCallback(async () => {
    const id = ++opIdRef.current
    await window.electronAPI.devServer.stop()
    if (id === opIdRef.current) {
      setPort(null)
      setStarting(false)
      activeRef.current = false
      currentDirRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (activeRef.current) {
        window.electronAPI.devServer.stop()
      }
    }
  }, [])

  return { port, starting, logs, start, selectComponent, stop }
}
