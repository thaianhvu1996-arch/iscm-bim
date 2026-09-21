import type { BlockId, Equipment, EquipmentSystem, MaintenanceTask } from '../types'
import type { Lang } from '../i18n/LanguageContext'
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

const same = (s: string): Record<Lang, string> => ({ vi: s, en: s })

interface TypeDef {
  name: Record<Lang, string>
  system: EquipmentSystem
  manufacturers: string[]
  modelPrefix: string
  capacity: (r: Rng) => Record<Lang, string>
  scope: 'perBlock' | 'project' | 'spread'
  count?: number
  location: (block: BlockId | 'Toàn dự án') => Record<Lang, string>
  maintenanceCycleMonths: number
  warrantyMonths: number
  installMonthRange: [number, number]
}

const flow = (min: number, max: number) => (r: Rng) => same(`${randInt(r, min, max)} m³/h`)
const power = (min: number, max: number) => (r: Rng) => same(`${randInt(r, min, max)} kW`)
const kva = (min: number, max: number) => (r: Rng) => same(`${randInt(r, min, max)} kVA`)
const airflow = (min: number, max: number) => (r: Rng) => same(`${randInt(r, min, max)} m³/h`)
const cool = (min: number, max: number) => (r: Rng) => same(`${randInt(r, min, max)} kBTU/h`)
const litres = (min: number, max: number) => (r: Rng) => {
  const n = randInt(r, min, max)
  return { vi: `${n} lít`, en: `${n} L` }
}

const centralFirePumpStationEn = { vi: 'Trạm bơm PCCC trung tâm', en: 'Central fire pump station' }
const securityGate = { vi: 'Cổng bảo vệ', en: 'Security gate' }

const TYPES: TypeDef[] = [
  // ----- PCCC -----
  {
    name: { vi: 'Máy bơm chữa cháy điện', en: 'Electric fire pump' }, system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara', 'Tyco'], modelPrefix: 'PFE',
    capacity: flow(120, 360), scope: 'project', count: 1,
    location: () => centralFirePumpStationEn, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Máy bơm chữa cháy diesel dự phòng', en: 'Standby diesel fire pump' }, system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara'], modelPrefix: 'PFD',
    capacity: flow(120, 360), scope: 'project', count: 1,
    location: () => centralFirePumpStationEn, maintenanceCycleMonths: 1, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Máy bơm bù áp (Jockey pump)', en: 'Jockey pump' }, system: 'PCCC',
    manufacturers: ['Pentax', 'Ebara'], modelPrefix: 'PJP',
    capacity: flow(5, 15), scope: 'project', count: 1,
    location: () => centralFirePumpStationEn, maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Bể nước dự trữ chữa cháy', en: 'Fire-reserve water tank' }, system: 'PCCC',
    manufacturers: ['Sơn Hà', 'Tân Á Đại Thành'], modelPrefix: 'BNC',
    capacity: litres(200_000, 450_000), scope: 'project', count: 1,
    location: () => centralFirePumpStationEn, maintenanceCycleMonths: 12, warrantyMonths: 60,
    installMonthRange: [1, 2],
  },
  {
    name: { vi: 'Tủ điều khiển bơm chữa cháy', en: 'Fire pump control panel' }, system: 'PCCC',
    manufacturers: ['Tyco', 'Horing'], modelPrefix: 'FCP',
    capacity: () => same('380V/3P/50Hz'), scope: 'project', count: 1,
    location: () => centralFirePumpStationEn, maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Tủ báo cháy trung tâm (FACP)', en: 'Fire alarm control panel (FACP)' }, system: 'PCCC',
    manufacturers: ['Hochiki', 'Nohmi Bosai', 'Horing'], modelPrefix: 'FACP',
    capacity: () => ({ vi: '2 loop / 254 địa chỉ', en: '2 loops / 254 addresses' }), scope: 'perBlock',
    location: (b) => ({ vi: `Phòng kỹ thuật ${b}`, en: `Technical room ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: { vi: 'Hộp chữa cháy vách tường (cụm khu vực)', en: 'Wall fire hose cabinet (area cluster)' }, system: 'PCCC',
    manufacturers: ['Horing', 'Alpha'], modelPrefix: 'HCC',
    capacity: () => ({ vi: 'DN65, cuộn vòi 30m', en: 'DN65, 30m hose reel' }), scope: 'perBlock',
    location: (b) => ({ vi: `Nhà xưởng ${b}`, en: `Warehouse ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: { vi: 'Đầu báo khói địa chỉ (cụm khu vực)', en: 'Addressable smoke detector (area cluster)' }, system: 'PCCC',
    manufacturers: ['Hochiki', 'Nohmi Bosai'], modelPrefix: 'SD',
    capacity: () => ({ vi: 'Cảm biến quang điện', en: 'Photoelectric sensor' }), scope: 'perBlock',
    location: (b) => ({ vi: `Nhà xưởng ${b}`, en: `Warehouse ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: { vi: 'Trụ chữa cháy ngoài nhà', en: 'Outdoor fire hydrant' }, system: 'PCCC',
    manufacturers: ['Horing', 'Alpha'], modelPrefix: 'FH',
    capacity: () => ({ vi: 'DN100, 2 họng', en: 'DN100, 2 outlets' }), scope: 'spread', count: 8,
    location: (b) => ({ vi: `Sân bãi ngoài nhà ${b}`, en: `Outdoor yard ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [2, 4],
  },
  {
    name: { vi: 'Bình chữa cháy xe đẩy (khu kỹ thuật)', en: 'Wheeled fire extinguisher (technical area)' }, system: 'PCCC',
    manufacturers: ['Alpha'], modelPrefix: 'MFZ',
    capacity: () => ({ vi: 'Bột ABC 35kg', en: '35kg ABC powder' }), scope: 'perBlock',
    location: (b) => ({ vi: `Khu kỹ thuật ${b}`, en: `Technical area ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [4, 7],
  },

  // ----- Điện -----
  {
    name: { vi: 'Trạm biến áp', en: 'Transformer station' }, system: 'Điện',
    manufacturers: ['Thibidi', 'ABB'], modelPrefix: 'TBA',
    capacity: kva(1000, 1600), scope: 'perBlock',
    location: (b) => ({ vi: `Trạm điện ${b}`, en: `Electrical station ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Tủ điện tổng MSB', en: 'Main switchboard (MSB)' }, system: 'Điện',
    manufacturers: ['Schneider Electric', 'ABB', 'LS'], modelPrefix: 'MSB',
    capacity: () => same('1600A, 3P+N'), scope: 'perBlock',
    location: (b) => ({ vi: `Phòng điện ${b}`, en: `Electrical room ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: { vi: 'Tủ điện phân phối DB', en: 'Distribution panel (DB)' }, system: 'Điện',
    manufacturers: ['Schneider Electric', 'LS'], modelPrefix: 'DB',
    capacity: () => same('250A, 3P+N'), scope: 'spread', count: 8,
    location: (b) => ({ vi: `Hành lang kỹ thuật ${b}`, en: `Technical corridor ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: { vi: 'Máy phát điện dự phòng', en: 'Standby generator' }, system: 'Điện',
    manufacturers: ['Cummins', 'Mitsubishi Electric'], modelPrefix: 'GEN',
    capacity: kva(500, 800), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Trạm điện ${b}`, en: `Electrical station ${b}` }), maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: { vi: 'Tủ chuyển nguồn tự động (ATS)', en: 'Automatic transfer switch (ATS)' }, system: 'Điện',
    manufacturers: ['Comap', 'Schneider Electric'], modelPrefix: 'ATS',
    capacity: () => same('800A'), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Trạm điện ${b}`, en: `Electrical station ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 4],
  },
  {
    name: { vi: 'Tủ tụ bù', en: 'Capacitor bank panel' }, system: 'Điện',
    manufacturers: ['Schneider Electric', 'LS'], modelPrefix: 'CAP',
    capacity: kva(150, 400), scope: 'perBlock',
    location: (b) => ({ vi: `Phòng điện ${b}`, en: `Electrical room ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [3, 5],
  },
  {
    name: { vi: 'Hệ thống chiếu sáng nhà xưởng & sự cố', en: 'Warehouse & emergency lighting system' }, system: 'Điện',
    manufacturers: ['Paragon', 'Điện Quang', 'Philips'], modelPrefix: 'LED',
    capacity: power(150, 250), scope: 'perBlock',
    location: (b) => ({ vi: `Nhà xưởng ${b}`, en: `Warehouse ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [5, 8],
  },

  // ----- Cấp thoát nước -----
  {
    name: { vi: 'Bơm nước sinh hoạt', en: 'Domestic water pump' }, system: 'Cấp thoát nước',
    manufacturers: ['Ebara', 'Pentax'], modelPrefix: 'PDW',
    capacity: flow(15, 40), scope: 'perBlock',
    location: (b) => ({ vi: `Phòng bơm nước ${b}`, en: `Water pump room ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: { vi: 'Bơm tăng áp', en: 'Booster pump' }, system: 'Cấp thoát nước',
    manufacturers: ['Grundfos', 'Ebara'], modelPrefix: 'PBA',
    capacity: flow(10, 25), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Phòng bơm nước ${b}`, en: `Water pump room ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [4, 6],
  },
  {
    name: { vi: 'Bơm nước thải (submersible)', en: 'Wastewater pump (submersible)' }, system: 'Cấp thoát nước',
    manufacturers: ['Tsurumi', 'Ebara'], modelPrefix: 'PWW',
    capacity: flow(8, 30), scope: 'spread', count: 8,
    location: (b) => ({ vi: `Trạm bơm nước thải ${b}`, en: `Wastewater pump station ${b}` }), maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [4, 7],
  },
  {
    name: { vi: 'Bể tự hoại', en: 'Septic tank' }, system: 'Cấp thoát nước',
    manufacturers: ['Sơn Hà'], modelPrefix: 'BTH',
    capacity: litres(15_000, 30_000), scope: 'perBlock',
    location: (b) => ({ vi: `Khu xử lý nước thải ${b}`, en: `Wastewater treatment area ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 60,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Bể tách dầu mỡ', en: 'Grease trap' }, system: 'Cấp thoát nước',
    manufacturers: ['Sơn Hà'], modelPrefix: 'BTM',
    capacity: litres(2_000, 5_000), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Khu xử lý nước thải ${b}`, en: `Wastewater treatment area ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 36,
    installMonthRange: [3, 4],
  },

  // ----- HVAC -----
  {
    name: { vi: 'Hệ thống điều hòa VRV khu văn phòng', en: 'VRV air-conditioning system, office area' }, system: 'HVAC',
    manufacturers: ['Daikin', 'Mitsubishi Electric', 'Panasonic'], modelPrefix: 'VRV',
    capacity: cool(96, 180), scope: 'perBlock',
    location: (b) => ({ vi: `Khu văn phòng ${b}`, en: `Office area ${b}` }), maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },
  {
    name: { vi: 'Quạt hút công nghiệp mái nhà xưởng', en: 'Warehouse roof industrial exhaust fan' }, system: 'HVAC',
    manufacturers: ['Fantech', 'Deton'], modelPrefix: 'FAN',
    capacity: airflow(8000, 25000), scope: 'spread', count: 14,
    location: (b) => ({ vi: `Mái nhà xưởng ${b}`, en: `Warehouse roof ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [5, 7],
  },
  {
    name: { vi: 'Quạt cấp gió tươi', en: 'Fresh-air supply fan' }, system: 'HVAC',
    manufacturers: ['Fantech', 'Deton'], modelPrefix: 'FAV',
    capacity: airflow(5000, 15000), scope: 'perBlock',
    location: (b) => ({ vi: `Nhà xưởng ${b}`, en: `Warehouse ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [5, 7],
  },
  {
    name: { vi: 'Chiller giải nhiệt gió', en: 'Air-cooled chiller' }, system: 'HVAC',
    manufacturers: ['Daikin', 'Trane', 'York'], modelPrefix: 'CHL',
    capacity: cool(50, 120), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Sân kỹ thuật ${b}`, en: `Technical yard ${b}` }), maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },

  // ----- Hạ tầng -----
  {
    name: { vi: 'Trạm bơm thoát nước mưa', en: 'Stormwater pump station' }, system: 'Hạ tầng',
    manufacturers: ['Tsurumi', 'Ebara'], modelPrefix: 'PSR',
    capacity: flow(80, 200), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Hồ điều hòa ${b}`, en: `Regulating pond ${b}` }), maintenanceCycleMonths: 6, warrantyMonths: 24,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Hệ thống xử lý nước mưa đợt đầu', en: 'First-flush rainwater treatment system' }, system: 'Hạ tầng',
    manufacturers: ['Sơn Hà'], modelPrefix: 'FFR',
    capacity: flow(50, 100), scope: 'project', count: 1,
    location: () => ({ vi: 'Khu xử lý nước mưa tập trung', en: 'Central rainwater treatment area' }), maintenanceCycleMonths: 6, warrantyMonths: 36,
    installMonthRange: [2, 3],
  },
  {
    name: { vi: 'Cổng barrier tự động', en: 'Automatic barrier gate' }, system: 'Hạ tầng',
    manufacturers: ['FAAC', 'BFT'], modelPrefix: 'BAR',
    capacity: () => ({ vi: 'Cần chắn 4m', en: '4m boom barrier' }), scope: 'spread', count: 2,
    location: () => securityGate, maintenanceCycleMonths: 6, warrantyMonths: 12,
    installMonthRange: [7, 8],
  },
  {
    name: { vi: 'Trạm cân xe tải', en: 'Truck weighbridge' }, system: 'Hạ tầng',
    manufacturers: ['Sartorius', 'Mettler Toledo'], modelPrefix: 'WBR',
    capacity: () => ({ vi: 'Tải trọng 60 tấn', en: '60-ton capacity' }), scope: 'project', count: 1,
    location: () => securityGate, maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [7, 8],
  },
  {
    name: { vi: 'Hệ thống camera an ninh', en: 'Security camera system' }, system: 'Hạ tầng',
    manufacturers: ['Hikvision', 'Dahua'], modelPrefix: 'CAM',
    capacity: () => ({ vi: '32 kênh, độ phân giải 4MP', en: '32 channels, 4MP resolution' }), scope: 'perBlock',
    location: (b) => ({ vi: `Khu vực ${b}`, en: `Area ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 24,
    installMonthRange: [7, 9],
  },
  {
    name: { vi: 'Đèn chiếu sáng sân bãi', en: 'Yard lighting' }, system: 'Hạ tầng',
    manufacturers: ['Philips', 'Rạng Đông'], modelPrefix: 'PLE',
    capacity: power(150, 250), scope: 'perBlock',
    location: (b) => ({ vi: `Sân bãi ${b}`, en: `Yard ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [6, 8],
  },
  {
    name: { vi: 'Hệ thống chống sét & tiếp địa', en: 'Lightning protection & grounding system' }, system: 'Hạ tầng',
    manufacturers: ['ERICO', 'Nemtek'], modelPrefix: 'LPS',
    capacity: () => ({ vi: 'Kim thu sét tia tiên đạo, bán kính 60m', en: 'Early streamer emission air terminal, 60m radius' }), scope: 'perBlock',
    location: (b) => ({ vi: `Mái nhà xưởng ${b}`, en: `Warehouse roof ${b}` }), maintenanceCycleMonths: 12, warrantyMonths: 36,
    installMonthRange: [5, 7],
  },
  {
    name: { vi: 'Máy nén khí trung tâm', en: 'Central air compressor' }, system: 'Hạ tầng',
    manufacturers: ['Hitachi', 'Fusheng', 'Puma'], modelPrefix: 'ACP',
    capacity: power(15, 37), scope: 'spread', count: 2,
    location: (b) => ({ vi: `Khu kỹ thuật ${b}`, en: `Technical area ${b}` }), maintenanceCycleMonths: 3, warrantyMonths: 24,
    installMonthRange: [6, 8],
  },
]

const DOC_KINDS: Array<Record<Lang, string>> = [
  { vi: 'Catalogue kỹ thuật', en: 'Technical catalogue' },
  { vi: 'Biên bản nghiệm thu', en: 'Acceptance record' },
  { vi: 'Hướng dẫn vận hành & bảo trì', en: 'Operation & maintenance manual' },
  { vi: 'Chứng chỉ CO/CQ', en: 'CO/CQ certificate' },
  { vi: 'Bản vẽ hoàn công', en: 'As-built drawing' },
]

function makeDocs(prefix: string, id: string): Record<Lang, string[]> {
  const n = randInt(rng, 2, 4)
  const kinds = shuffle(rng, DOC_KINDS).slice(0, n)
  return {
    vi: kinds.map((k) => `${k.vi} - ${prefix} (${id}).pdf`),
    en: kinds.map((k) => `${k.en} - ${prefix} (${id}).pdf`),
  }
}

function buildMaintenanceSchedule(cycleMonths: number, installDate: Date): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = []
  let cursor = installDate
  while (cursor <= CURRENT_DATE) {
    cursor = addMonths(cursor, cycleMonths)
  }
  while (daysBetween(CURRENT_DATE, cursor) <= 365 && tasks.length < 6) {
    tasks.push({ date: cursor, task: { vi: 'Bảo trì định kỳ', en: 'Periodic maintenance' } })
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
      const showCluster = totalClusters > 1 && t.scope === 'spread'
      const clusterSuffixVi = showCluster ? ` (cụm ${cluster})` : ''
      const clusterSuffixEn = showCluster ? ` (cluster ${cluster})` : ''

      list.push({
        id,
        name: {
          vi: `${t.name.vi}${blockSuffix}${clusterSuffixVi}`,
          en: `${t.name.en}${blockSuffix}${clusterSuffixEn}`,
        },
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
