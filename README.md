# BIM Monitoring Platform — Demo năng lực ISCM–UEH

Web app demo (không backend) minh hoạ năng lực xây dựng nền tảng giám sát công trình
bằng BIM của **Viện Đô thị Thông minh và Quản lý (ISCM) — Trường Công nghệ và Thiết kế,
Đại học Kinh tế TP.HCM (UEH)**. Dữ liệu là dữ liệu mô phỏng cho một công trình minh hoạ
(nhà xưởng công nghiệp cho thuê, 39.000m², 4 block, 9 tháng thi công) — không gắn với
dự án, nhà thầu hay chủ đầu tư cụ thể nào. Dùng để trình bày năng lực tư vấn/triển khai
BIM với đối tác, giảng viên, ban giám đốc nhà thầu hoặc chủ đầu tư.

App mở ra ở màn hình giới thiệu (Intro) trước, sau đó vào nền tảng vận hành thật với 8
màn hình theo vai trò. Xem `DEMO-SCRIPT.md` để có kịch bản trình bày ~13 phút.

## 1. Cách chạy

Yêu cầu: Node.js 18+.

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ mà terminal in ra (mặc định `http://localhost:5173`).

Build bản tĩnh để mở trực tiếp bằng file hoặc deploy lên hosting bất kỳ:

```bash
npm run build
```

Kết quả nằm trong thư mục `dist/`. `vite.config.ts` đã cấu hình `base: './'` nên có thể mở
`dist/index.html` trực tiếp bằng trình duyệt (không cần server) hoặc host tĩnh ở bất kỳ đường dẫn nào.

## 2. Cấu trúc thư mục

```
src/
  data/          Toàn bộ dữ liệu mẫu (không có backend/API)
    constants.ts     Thông tin công trình minh hoạ, 4 block, mốc thời gian, bảng màu, brand tokens
    clashes.ts        Generator ~340 xung đột (seeded random, ổn định qua các lần tải lại)
    quantities.ts       Generator ~90 hạng mục khối lượng 5D (6 nhóm công tác) + 3 đợt bóc tách mua sắm
    equipment.ts          Generator ~120 thiết bị
    fieldChanges.ts         Generator ~60 thay đổi hiện trường
    schedule.ts               45 hạng mục tiến độ (tính toán % hoàn thành theo ngày hiện tại)
    modelVersions.ts            6 phiên bản mô hình + mức khớp hiện trạng theo block
    tenantInfo.ts                 Thông tin cho thuê 4 block
    sitePhotos.ts                   Danh sách ảnh hiện trường (placeholder)
    alerts.ts                         Cảnh báo dashboard (suy ra từ dữ liệu xung đột/tiến độ)
    people.ts                           Danh sách tên người Việt theo vai trò
    roles.ts                              Ma trận phân quyền theo vai trò + danh sách màn hình

  assets/logos/  Logo chính thức UEH / CTD / ISCM (bản trắng cho nền tối + bản rút gọn)

  screens/       Mỗi màn hình một thư mục con
    Intro/          Màn hình giới thiệu (mặc định khi mở app) — hero 3D wireframe, năng lực
                     ISCM–UEH, khái niệm BIM, vòng đời thông tin công trình (7 giai đoạn,
                     bấm vào để nhảy thẳng tới màn hình tương ứng)
    Dashboard/     Tổng quan (Bento grid các KPI + biểu đồ)
    Model3D/         Mô hình 3D (Three.js, dựng procedurally, 4D theo tháng thi công)
    Schedule/          Tiến độ thi công
    Quantity/            Khối lượng & Chi phí (5D) — đối chiếu khối lượng hợp đồng vs mô
                         hình, liên kết "Xem trên mô hình 3D" sang màn Model3D
    Clash/                 Kiểm tra xung đột
    AsBuilt/                 Hoàn công & Thay đổi hiện trường
    Assets/                    Dữ liệu tài sản & Vận hành

  components/common/   KpiCard, Badge, ChartTooltip - dùng chung nhiều màn hình
  components/layout/   Sidebar, TopBar, AppShell (glassmorphism, floating panels)
  context/RoleContext.tsx   State vai trò hiện tại (không đăng nhập thật)
  utils/                Hàm định dạng số/ngày kiểu VN, seeded RNG, hình học 3D, mapping màu trạng thái
  types/index.ts         Toàn bộ kiểu dữ liệu dùng chung, AppView (intro | 7 màn hình)
```

Không có thư mục `api/` hay `server/` — toàn bộ dữ liệu sinh ra khi ứng dụng tải trong
trình duyệt, dùng seed cố định nên số liệu không đổi giữa các lần refresh.

## 3. Sửa dữ liệu mẫu ở đâu

- **Đổi thông tin công trình minh hoạ, mốc thời gian, giá trị hợp đồng, 4 block**:
  `src/data/constants.ts`
- **Đổi số lượng/tỷ lệ xung đột, thêm mẫu mô tả xung đột mới**: `src/data/clashes.ts`
  (mảng `TEMPLATES` - mỗi phần tử là một khuôn mô tả xung đột, `TOTAL_CLASHES` là tổng số)
- **Đổi hạng mục khối lượng 5D, đơn giá, tỷ lệ chênh lệch**: `src/data/quantities.ts`
  (mảng `TEMPLATES` theo 6 nhóm công tác; `chance(rng, 0.17)` quyết định tỷ lệ hạng mục bị
  gắn cờ chênh lệch lớn)
- **Đổi danh mục thiết bị**: `src/data/equipment.ts` (mảng `TYPES`)
- **Đổi hạng mục tiến độ, ngày tháng, % chậm**: `src/data/schedule.ts` (mảng `TEMPLATES`)
- **Đổi tên người**: `src/data/people.ts`
- **Đổi ma trận phân quyền, danh sách màn hình từng vai trò**: `src/data/roles.ts`

Vì dữ liệu được sinh bằng seeded RNG (`src/utils/random.ts`), sửa số lượng bản ghi hoặc
tham số sẽ tự động lan sang các chỉ số tổng hợp trên Dashboard (nhờ các hàm trong
`src/utils/metrics.ts`) — không cần sửa số liệu ở nhiều nơi. Sau khi sửa, đối chiếu lại
bảng số liệu trong `DEMO-SCRIPT.md`.

## 4. Thiết kế — Dark Glassmorphism, brand ISCM–UEH

- Nền tối `#0a0e17`, các panel dùng lớp kính mờ (`backdrop-filter: blur`) qua class dùng
  chung `.glass` / `.glass-strong` / `.glass-hover` trong `src/index.css`.
- Màu thương hiệu duy nhất: **ISCM Red `#C72127`** cho nút chính, mục điều hướng đang chọn,
  điểm nhấn. Cyan `#00F2FE` chỉ dùng cho lớp MEP trong 3D và đường biểu đồ phụ.
  Không đổi màu thương hiệu sang màu khác.
- Font: IBM Plex Sans (tiêu đề) + Barlow (nội dung), tải qua Google Fonts trong `index.css`.
- Logo UEH–CTD–ISCM lấy từ `src/assets/logos/`, chỉ dùng bản trắng trên nền tối, giữ
  nguyên tỉ lệ 1:1:1 theo chiều cao, không thêm hiệu ứng glow/xoay/đổi màu lên logo.

## 5. Công nghệ

Vite + React 19 + TypeScript + Tailwind CSS v4 + Three.js (`@react-three/fiber`,
`@react-three/drei`) + Recharts + lucide-react. Không backend, không `localStorage`.

## 6. Ba vai trò demo

Đổi vai trò bằng nút góc trên bên phải, không cần đăng nhập:

- **Ban Giám đốc nhà thầu** — xem đủ 7 màn hình (gồm cả Khối lượng & Chi phí), đầy đủ dữ liệu.
- **Chủ đầu tư** — chỉ thấy Tổng quan, Mô hình 3D, Tiến độ, Tài sản & Vận hành (4 màn
  hình). Khối lượng & Chi phí và xung đột chi tiết bị ẩn (marker trên mô hình 3D và cảnh
  báo xung đột trên Dashboard cũng ẩn).
- **Quản lý BIM** — như Ban Giám đốc, cộng thêm quyền đổi trạng thái xung đột ở màn
  Kiểm tra xung đột (thao tác chỉ lưu trong phiên làm việc, không có backend).

Bấm vào logo ở góc trên bên trái thanh điều hướng để quay lại màn hình giới thiệu bất kỳ
lúc nào. Xem `DEMO-SCRIPT.md` để có kịch bản trình bày đầy đủ.
