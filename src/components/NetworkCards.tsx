import { formatBytes } from '../lib/utils'
import type { NetworkInfo } from '../types'

interface NetworkCardsProps {
  networks: NetworkInfo[]
}

export function NetworkCards({ networks }: NetworkCardsProps) {
  if (networks.length === 0) return null

  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <h2 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-2)' }}>Network</h2>
      <div className="space-y-2">
        {networks.slice(0, 4).map((net) => (
          <div
            key={net.name}
            className="flex items-center justify-between px-2 py-1.5 rounded"
            style={{ background: 'var(--bg-surface)' }}
          >
            <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
              {net.name}
            </span>
            <div className="flex gap-4 text-xs">
              <span style={{ color: 'var(--green)' }}>
                ↓ {formatBytes(net.rxBytes)}
              </span>
              <span style={{ color: 'var(--blue)' }}>
                ↑ {formatBytes(net.txBytes)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
