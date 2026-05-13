import { formatBytes, formatUptime } from '../lib/utils'
import type { SystemInfo, MemoryInfo } from '../types'

interface SystemHeaderProps {
  system: SystemInfo
  memory: MemoryInfo
}

export function SystemHeader({ system, memory }: SystemHeaderProps) {
  const memPct = memory.total > 0 ? (memory.used / memory.total) * 100 : 0

  return (
    <div
      className="flex items-center gap-6 px-4 py-2 border-b"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-alt)' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--amber)' }}>SysVisor</span>
        <span className="text-xs" style={{ color: 'var(--text-3)' }}>
          {system.osName} {system.osVersion}
        </span>
      </div>

      <div className="flex-1" />

      <span className="text-xs" style={{ color: 'var(--text-2)' }}>
        {system.hostname}
      </span>

      <span className="text-xs" style={{ color: 'var(--text-3)' }}>
        up {formatUptime(system.uptimeSecs)}
      </span>

      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--text-2)' }}>RAM</span>
        <div
          className="h-1.5 w-24 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${memPct}%`,
              background: memPct > 85 ? 'var(--red)' : memPct > 60 ? 'var(--amber)' : 'var(--green)',
            }}
          />
        </div>
        <span className="text-xs" style={{ color: 'var(--text-2)' }}>
          {formatBytes(memory.used)} / {formatBytes(memory.total)}
        </span>
      </div>
    </div>
  )
}
