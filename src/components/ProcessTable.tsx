import { formatBytes } from '../lib/utils'
import type { ProcessInfo } from '../types'

interface ProcessTableProps {
  processes: ProcessInfo[]
  onKill: (pid: number) => void
}

export function ProcessTable({ processes, onKill }: ProcessTableProps) {
  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ background: 'var(--bg-alt)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Top Processes</h2>
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: 'var(--bg-surface)' }}>
              <th className="px-3 py-1.5 text-left font-medium" style={{ color: 'var(--text-3)' }}>PID</th>
              <th className="px-3 py-1.5 text-left font-medium" style={{ color: 'var(--text-3)' }}>Name</th>
              <th className="px-3 py-1.5 text-right font-medium" style={{ color: 'var(--text-3)' }}>CPU%</th>
              <th className="px-3 py-1.5 text-right font-medium" style={{ color: 'var(--text-3)' }}>Mem</th>
              <th className="px-3 py-1.5 text-right font-medium" style={{ color: 'var(--text-3)' }}></th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc) => (
              <tr
                key={proc.pid}
                className="border-t transition-colors hover:brightness-110"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="px-3 py-1.5 tabular-nums" style={{ color: 'var(--text-3)' }}>
                  {proc.pid}
                </td>
                <td className="px-3 py-1.5 truncate max-w-32" style={{ color: 'var(--text)' }}>
                  {proc.name}
                </td>
                <td
                  className="px-3 py-1.5 text-right tabular-nums"
                  style={{ color: proc.cpuUsage > 50 ? 'var(--red)' : proc.cpuUsage > 20 ? 'var(--amber)' : 'var(--text-2)' }}
                >
                  {proc.cpuUsage.toFixed(1)}
                </td>
                <td className="px-3 py-1.5 text-right tabular-nums" style={{ color: 'var(--text-2)' }}>
                  {formatBytes(proc.memoryBytes)}
                </td>
                <td className="px-3 py-1.5 text-right">
                  <button
                    onClick={() => onKill(proc.pid)}
                    className="text-xs px-1.5 py-0.5 rounded opacity-0 hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--red)', background: 'rgba(218,54,51,0.1)' }}
                  >
                    kill
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
