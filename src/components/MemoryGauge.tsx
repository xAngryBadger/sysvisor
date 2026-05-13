import { formatBytes, usageColor } from '../lib/utils'
import type { MemoryInfo } from '../types'

interface MemoryGaugeProps {
  memory: MemoryInfo
}

export function MemoryGauge({ memory }: MemoryGaugeProps) {
  const memPct = memory.total > 0 ? (memory.used / memory.total) * 100 : 0
  const swapPct = memory.swapTotal > 0 ? (memory.swapUsed / memory.swapTotal) * 100 : 0

  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Memory</h2>
        <span className="text-lg font-bold tabular-nums" style={{ color: usageColor(memPct) }}>
          {memPct.toFixed(1)}%
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-3)' }}>
            <span>RAM</span>
            <span>{formatBytes(memory.used)} / {formatBytes(memory.total)}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${memPct}%`, background: usageColor(memPct) }}
            />
          </div>
        </div>

        {memory.swapTotal > 0 && (
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-3)' }}>
              <span>Swap</span>
              <span>{formatBytes(memory.swapUsed)} / {formatBytes(memory.swapTotal)}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${swapPct}%`, background: usageColor(swapPct) }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
