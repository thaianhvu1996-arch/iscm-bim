import type { BlockId, Equipment, EquipmentSystem, MaintenanceTask } from '../types'
import { BLOCK_IDS, PROJECT_START, CURRENT_DATE } from './constants'
import { createRng, pick, randInt, addMonths, daysBetween, shuffle, type Rng } from '../utils/random'

const rng = createRng(551247)

function monthDate(monthIndex: number, day: number): Date {
  const d = new Date(PROJECT_START)
  d.setMonth(d.getMonth() + (monthIndex - 1))
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  d.setDate(Math.min(day, lastDay))
  return d
}

interface TypeDef {
  name: string
  system: EquipmentSystem
  manufacturers: string[]
  modelPrefix: string
  capacity: (r: Rng) => string
  scope: 'perBlock' | 'project' | 'spread'
  count?: number
  location: (block: BlockId | 'Toàn dự án') => string
  maintenanceCycleMonths: number
  warrantyMonths: number
  installMonthRange: [number, number]
}

const flow = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} m³/h`
const power = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} kW`
const kva = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} kVA`
const airflow = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} m³/h`
const cool = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} kBTU/h`
const litres = (min: number, max: number) => (r: Rng) => `${randInt(r, min, max)} lít`

const TYPES: TypeDef[] = [
  // ----- PCCC -----
  {
    name: 'Máy bơm chữa cháy điện', system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara', 'Tyco'], modelPrefix: 'PFE',
    capacity: flow(120, 360), scope: 'project', count: 1,
    location: () => 'Trạm bơm PCCC trung tâm', maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: 'Máy bơm chữa cháy diesel dự phòng', system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara'], modelPrefix: 'PFD',
    capacity: flow(120, 360), scope: 'project', count: 1,
    location: () => 'Trạm bơm PCCC trung tâm', maintenanceCycleMonths: 1, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: 'Máy bơm bù áp (Jockey pump)', system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara'], modelPrefix: 'PJP',
    capacity: flow(5, 15), scope: 'project', count: 1,
    location: () => 'Trạm bơm PCCC trung tâm', maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: 'Bể nước dự trữ chữa cháy', system: 'PCCC',
    manufacturers: ['Sơn Hà', 'Tân Á Đại Thành'], modelPrefix: 'BNC',
    capacity: litres(200_000, 450_000), scope: 'project', count: 1,
    location: () => 'Trạm bơm PCCC trung tâm', maintenanceCycleMonths: 12, warrantyMonths: 60,
    installMonthRange: [1, 2],
  },
  {
    name: 'Tủ điều khiển bơm chữa cháy', system: 'PCCC',
    manufacturers: ['Tyco', 'Horing'], modelPrefix: 'FCP',
    capacity: () => '380V/3P/50Hz', scope: 'project', count: 1,
    location: () => 'Trạm bơm PCCC trung tâm', maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: 'Tủ báo cháy trung tâm (FACP)', system: 'PCCC',
    manufacturers: ['Hochiki', 'Nohmi Bosai', 'Horing'], modelPrefix: 'FACP',
    capacity: () => '2 loop / 254 địa chỉ', scope: 'perBlock',
    location: (b) => `Phòng kỹ thuật ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: 'Hộp chữa cháy vách tường (cụm khu vực)', system: 'PCCC',
    manufacturers: ['Horing', 'Alpha'], modelPrefix: 'HCC',
    capacity: () => 'DN65, cuộn vòi 30m', scope: 'perBlock',
    location: (b) => `Nhà xưởng ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: 'Đầu báo khói địa chỉ (cụm khu vực)', system: 'PCCC',
    manufacturers: ['Hochiki', 'Nohmi Bosai'], modelPrefix: 'SD',
    capacity: () => 'Cảm biến quang điện', scope: 'perBlock',
    location: (b) => `Nhà xưởng ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: 'Trụ chữa cháy ngoài nhà', system: 'PCCC',
    manufacturers: ['Horing', 'Alpha'], modelPrefix: 'FH',
    capacity: () => 'DN100, 2 họng', scope: 'spread', count: 8,
    location: (b) => `Sân bãi ngoài nhà ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [2, 4],
  },
  {
    name: 'Bình chữa cháy xe đẩy (khu kỹ thuật)', system: 'PCCC',
    manufacturers: ['Alpha'], modelPrefix: 'MFZ',
    capacity: () => 'Bột ABC 35kg', scope: 'perBlock',
    location: (b) => `Khu kỹ thuật ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [4, 7],
  },

  // ----- Điện -----
  {
    name: 'Trạm biến áp', system: 'Điện',
    manufacturers: ['Thibidi', 'ABB'], modelPrefix: 'TBA',
    capacity: kva(1000, 1600), scope: 'perBlock',
    location: (b) => `Trạm điện ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [2, 3],
  },
  {
    name: 'Tủ điện tổng MSB', system: 'Điện',
    manufacturers: ['Schneider Electric', 'ABB', 'LS'], modelPrefix: 'MSB',
    capacity: () => '1600A, 3P+N', scope: 'perBlock',
    location: (b) => `Phòng điện ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: 'Tủ điện phân phối DB', system: 'Điện',
    manufacturers: ['Schneider Electric', 'LS'], modelPrefix: 'DB',
    capacity: () => '250A, 3P+N', scope: 'spread', count: 8,
    location: (b) => `Hành lang kỹ thuật ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: 'Máy phát điện dự phòng', system: 'Điện',
    manufacturers: ['Cummins', 'Mitsubishi Electric'], modelPrefix: 'GEN',
    capacity: kva(500, 800), scope: 'spread', count: 2,
    location: (b) => `Trạm điện ${b}`, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: 'Tủ chuyển nguồn tự động (ATS)', system: 'Điện',
    manufacturers: ['Comap', 'Schneider Electric'], modelPrefix: 'ATS',
    capacity: () => '800A', scope: 'spread', count: 2,
    location: (b) => `Trạm điện ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: 'Tủ tụ bù', system: 'Điện',
    manufacturers: ['Schneider Electric', 'LS'], modelPrefix: 'CAP',
    capacity: kva(150, 400), scope: 'perBlock',
    location: (b) => `Phòng điện ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 5],
  },
  {
    name: 'Hệ thống chiếu sáng nhà xưởng & sự cố', system: 'Điện',
    manufacturers: ['Paragon', 'Điện Quang', 'Philips'], modelPrefix: 'LED',
    capacity: power(150, 250), scope: 'perBlock',
    location: (b) => `Nhà xưởng ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [5, 8],
  },

  // ----- Cấp thoát nước -----
  {
    name: 'Bơm nước sinh hoạt', system: 'Cấp thoát nước',
    manufacturers: ['Ebara', 'Pentax'], modelPrefix: 'PDW',
    capacity: flow(15, 40), scope: 'perBlock',
    location: (b) => `Phòng bơm nước ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: 'Bơm tăng áp', system: 'Cấp thoát nước',
    manufacturers: ['Grundfos', 'Ebara'], modelPrefix: 'PBA',
    capacity: flow(10, 25), scope: 'spread', count: 2,
    location: (b) => `Phòng bơm nước ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: 'Bơm nước thải (submersible)', system: 'Cấp thoát nước',
    manufacturers: ['Tsurumi', 'Ebara'], modelPrefix: 'PWW',
    capacity: flow(8, 30), scope: 'spread', count: 8,
    location: (b) => `Trạm bơm nước thải ${b}`, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: 'Bể tự hoại', system: 'Cấp thoát nước',
    manufacturers: ['Sơn Hà'], modelPrefix: 'BTH',
    capacity: litres(15_000, 30_000), scope: 'perBlock',
    location: (b) => `Khu xử lý nước thải ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 60,
    installMonthRange: [2, 3],
  },
  {
    name: 'Bể tách dầu mỡ', system: 'Cấp thoát nước',
    manufacturers: ['Sơn Hà'], modelPrefix: 'BTM',
    capacity: litres(2_000, 5_000), scope: 'spread', count: 2,
    location: (b) => `Khu xử lý nước thải ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 36,
    installMonthRange: [3, 4],
  },

  // ----- HVAC -----
  {
    name: 'Hệ thống điều hòa VRV khu văn phòng', system: 'HVAC',
    manufacturers: ['Daikin', 'Mitsubishi Electric', 'Panasonic'], modelPrefix: 'VRV',
    capacity: cool(96, 180), scope: 'perBlock',
    location: (b) => `Khu văn phòng ${b}`, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },
  {
    name: 'Quạt hút công nghiệp mái nhà xưởng', system: 'HVAC',
    manufacturers: ['Fantech', 'Deton'], modelPrefix: 'FAN',
    capacity: airflow(8000, 25000), scope: 'spread', count: 14,
    location: (b) => `Mái nhà xưởng ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [5, 7],
  },
  {
    name: 'Quạt cấp gió tươi', system: 'HVAC',
    manufacturers: ['Fantech', 'Deton'], modelPrefix: 'FAV',
    capacity: airflow(5000, 15000), scope: 'perBlock',
    location: (b) => `Nhà xưởng ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [5, 7],
  },
  {
    name: 'Chiller giải nhiệt gió', system: 'HVAC',
    manufacturers: ['Daikin', 'Trane', 'York'], modelPrefix: 'CHL',
    capacity: cool(50, 120), scope: 'spread', count: 2,
    location: (b) => `Sân kỹ thuật ${b}`, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },

  // ----- Hạ tầng -----
  {
    name: 'Trạm bơm thoát nước mưa', system: 'Hạ tầng',
    manufacturers: ['Tsurumi', 'Ebara'], modelPrefix: 'PSR',
    capacity: flow(80, 200), scope: 'spread', count: 2,
    location: (b) => `Hồ điều hòa ${b}`, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: 'Hệ thống xử lý nước mưa đợt đầu', system: 'Hạ tầng',
    manufacturers: ['Sơn Hà'], modelPrefix: 'FFR',
    capacity: flow(50, 100), scope: 'project', count: 1,
    location: () => 'Khu xử lý nước mưa tập trung', maintenanceCycleMonths: 6, warrantyMonths: 36,
    installMonthRange: [2, 3],
  },
  {
    name: 'Cổng barrier tự động', system: 'Hạ tầng',
    manufacturers: ['FAAC', 'BFT'], modelPrefix: 'BAR',
    capacity: () => 'Cần chắn 4m', scope: 'spread', count: 2,
    location: () => 'Cổng bảo vệ', maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [7, 8],
  },
  {
    name: 'Trạm cân xe tải', system: 'Hạ tầng',
    manufacturers: ['Sartorius', 'Mettler Toledo'], modelPrefix: 'WBR',
    capacity: () => 'Tải trọng 60 tấn', scope: 'project', count: 1,
    location: () => 'Cổng bảo vệ', maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [7, 8],
  },
  {
    name: 'Hệ thống camera an ninh', system: 'Hạ tầng',
    manufacturers: ['Hikvision', 'Dahua'], modelPrefix: 'CAM',
    capacity: () => '32 kênh, độ phân giải 4MP', scope: 'perBlock',
    location: (b) => `Khu vực ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [7, 9],
  },
  {
    name: 'Đèn chiếu sáng sân bãi', system: 'Hạ tầng',
    manufacturers: ['Philips', 'Rạng Đông'], modelPrefix: 'PLE',
    capacity: power(150, 250), scope: 'perBlock',
    location: (b) => `Sân bãi ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [6, 8],
  },
  {
    name: 'Hệ thống chống sét & tiếp địa', system: 'Hạ tầng',
    manufacturers: ['ERICO', 'Nemtek'], modelPrefix: 'LPS',
    capacity: () => 'Kim thu sét tia tiên đạo, bán kính 60m', scope: 'perBlock',
    location: (b) => `Mái nhà xưởng ${b}`, maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [5, 7],
  },
  {
    name: 'Máy nén khí trung tâm', system: 'Hạ tầng',
    manufacturers: ['Hitachi', 'Fusheng', 'Puma'], modelPrefix: 'ACP',
    capacity: power(15, 37), scope: 'spread', count: 2,
    location: (b) => `Khu kỹ thuật ${b}`, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },
]

const DOC_KINDS = [
  'Catalogue kỹ thuật',
  'Biên bản nghiệm thu',
  'Hướng dẫn vận hành & bảo trì',
  'Chứng chỉ CO/CQ',
  'Bản vẽ hoàn công',
]

function makeDocs(prefix: string, id: string): string[] {
  const n = randInt(rng, 2, 4)
  return shuffle(rng, DOC_KINDS)
    .slice(0, n)
    .map((k) => `${k} - ${prefix} (${id}).pdf`)
}

function buildMaintenanceSchedule(cycleMonths: number, installDate: Date): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = []
  let cursor = installDate
  while (cursor <= CURRENT_DATE) {
    cursor = addMonths(cursor, cycleMonths)
  }
  while (daysBetween(CURRENT_DATE, cursor) <= 365 && tasks.length < 6) {
    tasks.push({ date: cursor, task: 'Bảo trì định kỳ' })
    cursor = addMonths(cursor, cycleMonths)
  }
  return tasks
}

function generateEquipment(): Equipment[] {
  const list: Equipment[] = []
  let counter = 0

  for (const t of TYPES) {
    const blocksToUse: Array<BlockId | 'Toàn dự án'> =
      t.scope === 'perBlock'
        ? BLOCK_IDS
        : t.scope === 'project'
          ? Array(t.count ?? 1).fill('Toàn dự án')
          : Array.from({ length: t.count ?? 1 }, (_, i) => BLOCK_IDS[i % BLOCK_IDS.length])

    const totalClusters = Math.ceil(blocksToUse.length / BLOCK_IDS.length)

    blocksToUse.forEach((block, idx) => {
      counter += 1
      const id = `TB-${String(counter).padStart(4, '0')}`
      const manufacturer = pick(rng, t.manufacturers)
      const model = `${t.modelPrefix}-${randInt(rng, 100, 999)}`
      const monthIdx = randInt(rng, t.installMonthRange[0], t.installMonthRange[1])
      const installDate = monthDate(monthIdx, randInt(rng, 3, 26))
      const warrantyUntil = addMonths(installDate, t.warrantyMonths)

      const cluster = Math.floor(idx / BLOCK_IDS.length) + 1
      const blockSuffix = block !== 'Toàn dự án' ? ` - Block ${block}` : ''
      const clusterSuffix = totalClusters > 1 && t.scope === 'spread' ? ` (cụm ${cluster})` : ''

      list.push({
        id,
        name: `${t.name}${blockSuffix}${clusterSuffix}`,
        system: t.system,
        block,
        location: t.location(block),
        manufacturer,
        model,
        capacity: t.capacity(rng),
        installDate,
        warrantyUntil,
        maintenanceCycleMonths: t.maintenanceCycleMonths,
        documents: makeDocs(t.modelPrefix, id),
        upcomingMaintenance: buildMaintenanceSchedule(t.maintenanceCycleMonths, installDate),
      })
    })
  }

  return list
}

export const equipment: Equipment[] = generateEquipment()
