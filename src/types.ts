export interface SystemInfo {
  hostname: string
  osName: string
  osVersion: string
  kernelVersion: string
  uptimeSecs: number
  cpuCount: number
}

export interface CpuInfo {
  globalUsage: number
  coreUsages: number[]
}

export interface MemoryInfo {
  total: number
  used: number
  available: number
  swapTotal: number
  swapUsed: number
}

export interface DiskInfo {
  name: string
  mountPoint: string
  total: number
  used: number
  available: number
  fsType: string
}

export interface NetworkInfo {
  name: string
  rxBytes: number
  txBytes: number
}

export interface ProcessInfo {
  pid: number
  name: string
  cpuUsage: number
  memoryBytes: number
  status: string
}

export interface SystemSnapshot {
  system: SystemInfo
  cpu: CpuInfo
  memory: MemoryInfo
  disks: DiskInfo[]
  networks: NetworkInfo[]
  topProcesses: ProcessInfo[]
}
