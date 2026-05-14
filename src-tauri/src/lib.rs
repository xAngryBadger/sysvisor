use serde::Serialize;
use sysinfo::{Disks, Networks, Pid, System};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemInfo {
    hostname: String,
    os_name: String,
    os_version: String,
    kernel_version: String,
    uptime_secs: u64,
    cpu_count: usize,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuInfo {
    global_usage: f32,
    core_usages: Vec<f32>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryInfo {
    total: u64,
    used: u64,
    available: u64,
    swap_total: u64,
    swap_used: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DiskInfo {
    name: String,
    mount_point: String,
    total: u64,
    used: u64,
    available: u64,
    fs_type: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NetworkInfo {
    name: String,
    rx_bytes: u64,
    tx_bytes: u64,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProcessInfo {
    pid: u32,
    name: String,
    cpu_usage: f32,
    memory_bytes: u64,
    status: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemSnapshot {
    system: SystemInfo,
    cpu: CpuInfo,
    memory: MemoryInfo,
    disks: Vec<DiskInfo>,
    networks: Vec<NetworkInfo>,
    top_processes: Vec<ProcessInfo>,
}

#[tauri::command]
async fn get_system_snapshot() -> Result<SystemSnapshot, String> {
    let mut sys = System::new_all();
    sys.refresh_all();
    std::thread::sleep(std::time::Duration::from_millis(200));
    sys.refresh_all();

    let system = SystemInfo {
        hostname: System::host_name().unwrap_or_default(),
        os_name: System::name().unwrap_or_default(),
        os_version: System::os_version().unwrap_or_default(),
        kernel_version: System::kernel_version().unwrap_or_default(),
        uptime_secs: System::uptime(),
        cpu_count: sys.cpus().len(),
    };

    let cpu = CpuInfo {
        global_usage: sys.global_cpu_usage(),
        core_usages: sys.cpus().iter().map(|c| c.cpu_usage()).collect(),
    };

    let memory = MemoryInfo {
        total: sys.total_memory(),
        used: sys.used_memory(),
        available: sys.available_memory(),
        swap_total: sys.total_swap(),
        swap_used: sys.used_swap(),
    };

    let disks_info = Disks::new_with_refreshed_list();
    let disks = disks_info
        .iter()
        .map(|d| DiskInfo {
            name: d.name().to_string_lossy().to_string(),
            mount_point: d.mount_point().to_string_lossy().to_string(),
            total: d.total_space(),
            used: d.total_space() - d.available_space(),
            available: d.available_space(),
            fs_type: d.file_system().to_string_lossy().to_string(),
        })
        .collect();

    let networks_info = Networks::new_with_refreshed_list();
    let networks = networks_info
        .iter()
        .map(|(name, data)| NetworkInfo {
            name: name.to_string(),
            rx_bytes: data.received(),
            tx_bytes: data.transmitted(),
        })
        .collect();

    let mut processes: Vec<ProcessInfo> = sys
        .processes()
        .values()
        .map(|p| ProcessInfo {
            pid: p.pid().as_u32(),
            name: p.name().to_string_lossy().to_string(),
            cpu_usage: p.cpu_usage(),
            memory_bytes: p.memory(),
            status: format!("{:?}", p.status()),
        })
        .collect();

    processes.sort_by(|a, b| b.cpu_usage.partial_cmp(&a.cpu_usage).unwrap_or(std::cmp::Ordering::Equal));
    processes.truncate(20);

    Ok(SystemSnapshot {
        system,
        cpu,
        memory,
        disks,
        networks,
        top_processes: processes,
    })
}

#[tauri::command]
async fn kill_process(pid: u32) -> Result<bool, String> {
    let pid = Pid::from_u32(pid);
    if let Some(process) = System::new_all().process(pid) {
        Ok(process.kill())
    } else {
        Err(format!("Process {} not found", pid))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_system_snapshot, kill_process])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
