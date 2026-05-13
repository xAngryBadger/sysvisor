import { useState, useEffect, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { SystemHeader } from './components/SystemHeader'
import { CpuGauge } from './components/CpuGauge'
import { MemoryGauge } from './components/MemoryGauge'
import { DiskList } from './components/DiskList'
import { NetworkCards } from './components/NetworkCards'
import { ProcessTable } from './components/ProcessTable'
import type { SystemSnapshot } from './types'

const REFRESH_INTERVAL = 2000

function App() {
  const [snapshot, setSnapshot] = useState<SystemSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  const fetchSnapshot = useCallback(async () => {
    try {
      const result = await invoke<SystemSnapshot>('get_system_snapshot')
      setSnapshot(result)
      setError(null)
    } catch (e) {
      setError(String(e))
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const result = await invoke<SystemSnapshot>('get_system_snapshot')
        if (mounted) {
          setSnapshot(result)
          setError(null)
        }
      } catch (e) {
        if (mounted) setError(String(e))
      }
    }
    load()
    if (paused) return
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [paused])

  const handleKill = useCallback(async (pid: number) => {
    try {
      await invoke<boolean>('kill_process', { pid })
      setTimeout(fetchSnapshot, 500)
    } catch {
      // ignore
    }
  }, [fetchSnapshot])

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">📡</div>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>
            {error ? `Error: ${error}` : 'Loading system info...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg)' }}>
      <SystemHeader system={snapshot.system} memory={snapshot.memory} />

      <div className="flex items-center gap-2 px-4 py-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setPaused(!paused)}
          className="text-xs px-2 py-0.5 rounded"
          style={{
            background: paused ? 'var(--amber-dim)' : 'transparent',
            color: paused ? 'var(--amber)' : 'var(--text-3)',
            border: paused ? '1px solid var(--amber)' : '1px solid var(--border)',
          }}
        >
          {paused ? '⏸ Paused' : '● Live'}
        </button>
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          Refresh: {REFRESH_INTERVAL / 1000}s
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <CpuGauge cpu={snapshot.cpu} />
          <MemoryGauge memory={snapshot.memory} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <DiskList disks={snapshot.disks} />
          <NetworkCards networks={snapshot.networks} />
        </div>

        <ProcessTable processes={snapshot.topProcesses} onKill={handleKill} />
      </div>
    </div>
  )
}

export default App
