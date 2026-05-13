import { usageColor } from '../lib/utils'
import type { CpuInfo } from '../types'

interface CpuGaugeProps {
  cpu: CpuInfo
}

export function CpuGauge({ cpu }: CpuGaugeProps) {
  const pct = cpu.globalUsage

  return (
    <div
      className="rounded-lg p-4 border"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>CPU</h2>
        <span className="text-lg font-bold tabular-nums" style={{ color: usageColor(pct) }}>
          {pct.toFixed(1)}%
        </span>
      </div>

      <div
        className="h-2 rounded-full overflow-hidden mb-3"
        style={{ background: 'var(--bg-surface)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: usageColor(pct) }}
        />
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(cpu.coreUsages.length, 8)}, 1fr)` }}>
        {cpu.coreUsages.slice(0, 16).map((usage, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="h-8 w-full rounded-sm overflow-hidden relative"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-sm transition-all duration-700"
                style={{ height: `${usage}%`, background: usageColor(usage) }}
              />
            </div>
            <span className="text-xs mt-0.5" style={{ color: 'var(--text-3)', fontSize: 9 }}>
              {i}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
