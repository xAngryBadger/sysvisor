import { formatBytes, usageColor } from '../lib/utils'
import type { DiskInfo } from '../types'

interface DiskListProps {
  disks: DiskInfo[]
}

export function DiskList({ disks }: DiskListProps) {
  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <h2 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-2)' }}>Disks</h2>
      <div className="space-y-2">
        {disks.map((disk) => {
          const pct = disk.total > 0 ? (disk.used / disk.total) * 100 : 0
          return (
            <div key={disk.mountPoint}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: 'var(--text)' }}>{disk.mountPoint}</span>
                <span style={{ color: 'var(--text-3)' }}>
                  {formatBytes(disk.used)} / {formatBytes(disk.total)}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: usageColor(pct) }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
