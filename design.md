# Design System — VietTour (Tailwind v4)

## Context & Goals

VietTour là web du lịch (React + Vite + Tailwind CSS v4). Tài liệu này đứng trên guideline
`design.md` do extension Figma ("Acenda") sinh ra, nhưng được **translate sang Tailwind v4**
và **map vào token `@theme` có sẵn của VietTour** — giữ nguyên visual hiện tại (light, blue
family + amber accent), không áp palette dark của bản gốc.

- Ứng dụng: trang `/tours` (list, filter sidebar, card, pagination, hero) và các page khác.
- Nguyên tắc: ưu tiên **dùng Tailwind utility class trực tiếp**, không viết CSS custom trừ khi bắt buộc.
- Với mọi thành phần: khai báo đủ state default / hover / focus-visible / active / disabled / loading / error.

## Design Tokens & Foundations (map qua `@theme`)

Nguồn token chuẩn là `frontend/src/assets/styles/index.css` — đổi brand chỉ sửa ở đó.

| Token design.md (Acenda) | Giá trị gốc | Map sang Tailwind VietTour |
|---|---|---|
| `color.surface.base` | `#000000` | `bg-background` (body) — `--color-background: #f6f8fb` |
| `color.surface.raised` | `#2c2c2c` | `bg-surface` (card/panel trắng) — `--color-surface: #ffffff` |
| `color.surface.muted` | `#0c8ce9` | `bg-primary/5-10`, `bg-primary-50` |
| `color.text.primary` | `#ffffff` | `text-foreground` (text chính) — `--color-foreground: #0f172a` |
| `color.text.secondary` | `#7cc4f8` | `text-muted` (text phụ) — `--color-muted: #64748b` |
| brand | — | `bg-primary`/`text-primary` (+ `primary-light`, `primary-dark`, `primary-50`, `primary-100`), điểm nhấn `accent` (#f59e0b) |

### Typography (giữ scale hợp lý với web du lịch, không dùng base 11px)

- Font: `font.sans` → `--font-sans: "Lexend Deca", ...` (đã đặt ở body).
- Scale Tailwind tương ứng: `text-xs` (12px), `text-sm` (14px), `text-base` (16px),
  `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (30px). Line-height mặc định của Tailwind.
- Trọng số: `font-medium` (500) cho label/nhãn, `font-semibold`/`font-bold` cho tiêu đề & số tiền.

### Spacing scale (đổi từ px sang Tailwind `*4px`)

| Acenda | px | Tailwind |
|---|---|---|
| `space.1` | 2px | `p-0.5` / `gap-0.5` |
| `space.2` | 4px | `p-1` |
| `space.3` | 6px | `p-1.5` / `gap-1.5` |
| `space.4` | 7px | `p-1.5` ~ `p-2` / `gap-1.5` |
| `space.5` | 8px | `p-2` |
| `space.6` | 12px | `p-3` |
| `space.7` | 15px | `p-3.5` ~ `p-4` (lấy `p-4` trong UI) |

### Radius

| Acenda | px | Tailwind |
|---|---|---|
| `radius.xs` | 2px | `rounded-sm` |
| `radius.sm` | 5px | `rounded-md` (`rounded-[5px]` nếu cần chính xác) |
| `radius.md` | 50px | `rounded-full` (pills, avatar, heart button) |
| `radius.lg` | 73px | `rounded-full` cho vùng lớn (hero search, chip) |

### Motion

- `motion.duration.instant` = **150ms** → `duration-150` (hover nút/link).
- Hover card nâng: `duration-300`. Zoom ảnh: `duration-500`. Fade slide: `duration-1000`.

## Component-Level Rules

### Card tour (`TourListCard.jsx`)
- **Container**: `bg-surface rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgba(30,41,59,0.05)]`,
  hover: `-translate-y-1 hover:shadow-[0_16px_36px_rgba(30,41,59,0.12)] duration-300`.
- **Ảnh**: `w-full h-full object-cover group-hover:scale-105 duration-500` (cần `group` trên card + `overflow-hidden`); vùng tối chỉ dồn đáy ảnh `bg-linear-to-t from-slate-950/60 via-transparent to-transparent` (KHÔNG phủ trùm khung).
- **Tên**: `font-bold text-base text-slate-900 group-hover:text-primary line-clamp-2` (thẻ **`<h2>`** — trang h1 ở hero, card là h2).
- **Giá**: `font-extrabold text-rose-600` + label phụ `text-muted` (format `vi-VN`) — không có shadow màu halo quanh giá.
- **Badge "Cao cấp"** (price ≥ 8tr): pill đặc `bg-slate-950/75 text-amber-300 rounded-full text-[11px] font-semibold`, **không** gradient, **không** icon crown.
- **Heart**: `w-9 h-9 rounded-full bg-white/85` có `aria-label`; nằm góc phải trên ảnh.
- **Location/duration**: pill đặc `bg-slate-950/65 text-white rounded-md`, icon `text-amber-300` — không dùng glass (`backdrop-blur`) làm badge.
- **CTA**: `bg-primary hover:bg-primary-dark text-white rounded-lg/lg font-semibold bold`, chỉ `transition-colors`, không `shadow-primary/...` halo.
- **Grid mode**: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5`. **List mode**: `flex flex-col gap-4`.
- **Responsive**: card grid chuyển 1 → 2 → 3 cột theo breakpoint; `line-clamp-2` cho text dài; empty state có icon + nút reset filter.
- **KHÔNG có** chip mã tour (`TOUR001`), kicker, hay icon trang trí kiểu AI (crown/gem).

### FilterSidebar
- **Container**: `bg-surface rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-[85px] overflow-y-auto`.
- **Nhóm filter**: label `text-sm font-semibold text-foreground mb-3`, divider `border-b border-slate-100 pb-4 mb-4`.
- **Slider giá**: `accent-primary` + `w-full`, hiển thị 2 đầu `text-xs text-muted`.
- **Checkbox dịch vụ / radio duration**: `w-4 h-4 accent-primary`; label `text-sm text-slate-700`.
- **Nút Áp dụng**: `bg-primary hover:bg-primary-dark text-white w-full rounded-full py-3 font-bold duration-150` + focus-visible ring.
- **Responsive**: `hidden lg:block` desktop; mobile mở drawer `fixed inset-0 z-50` + backdrop `bg-black/50`.
- **Empty state**: services đang tải hiện "Đang tải dịch vụ...", không có data → message thay thế.

### HeroCarousel
- **Container**: `relative w-full h-[280px] sm:h-[330px] lg:h-[390px] overflow-hidden rounded-2xl lg:rounded-3xl` — **poster bo góc** đặt trong container trang, không tràn edge-to-edge.
- **Slide**: `absolute inset-0 object-cover` + `transition-opacity duration-1000`, `opacity-100` active / `opacity-0` ẩn; slide đầu `fetchPriority="high"`.
- **Overlay**: `bg-linear-to-t from-slate-950/75 via-slate-900/25 to-slate-900/10` — dồn tối về đáy để chữ nổi, không phủ đồng đều cả khung.
- **Title/desc**: soạn **góc dưới-bên trái** (`absolute bottom-0 px-6 sm:px-10 pb-16 sm:pb-20 max-w-3xl`), `text-white [text-shadow:0_1px_3px_rgba(15,23,42,0.4)]` gọn — **KHÔNG uppercase**, không `tracking-wide`, **KHÔNG kicker/eyebrow** "VietTour Premium".
- **Điều khiển**: mũi tên `w-9 h-9 rounded-full bg-white/15 hover:bg-white/30`; dots `h-1.5 rounded-full` đặt **góc dưới-phải** (`bottom-5 right-6 sm:right-10`), active `w-7 bg-white`.
- **Motion**: autoplay 5s bằng `setInterval` + fade 1s; tôn trọng `prefers-reduced-motion` (tắt autoplay nếu user chọn reduced).

### Pagination
- **Nút**: `w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-150`;
  default `bg-white border border-slate-200 text-foreground`, hover `bg-slate-50`; active `bg-primary text-white border-primary`.
- **Disabled** (biên): `opacity-50 cursor-not-allowed pointer-events-none`.
- **Responsive**: collapse khi `totalPages > 7` → `1 … x-1 x x+1 … total`; nút prev/next có `aria-label`.

### Nút / Input chung
- **Button primary**: `bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-2.5 px-6 duration-150`; focus-visible `ring-2 ring-primary/40 ring-offset-2 outline-none`; disabled `opacity-50 cursor-not-allowed`.
- **Input SearchBox**: `rounded-full bg-white border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20`.

## Accessibility (WCAG 2.2 AA — có thể kiểm tra)

- **Contrast**: text chính `foreground` (#0f172a) trên `surface` → ~15:1 (đạt AA); text `muted` chỉ dùng cho text phụ ≥ 14px/500. **Không** dùng `primary-light` (#3b82f6) làm body text (tương phản 3.68:1) — chỉ ring/large text/badge.
- **Focus-visible**: mọi nút/link/input có `:focus-visible` ring (`outline-none` + `ring-2 ring-primary/40`). Pass = Tab đi qua hết, thấy rõ ring.
- **Keyboard/touch**: heart, filter, pagination, carousel đều là `<button>` gốc → Enter/Space hoạt động; vùng chạm ≥ 40px (heart 40px, nút pagination 44px).
- **Label**: nút icon có `aria-label`; slider dùng `<label htmlFor>`.
- **Reduced motion**: không bắt buộc, nhưng nên tôn trọng `prefers-reduced-motion` nếu dùng animation lớn.

## Content & Tone

- UI text bằng **Tiếng Việt**, ngắn gọn: tên tour, nút ("Xem chi tiết", "Đặt tour ngay"), label filter, message lỗi/thành công.
- Đồng nhất format giá `vi-VN` (vd "12.500.000đ"); tiêu đề rõ ràng, không lặp "tour tour".

## Anti-Patterns & Prohibited Implementations

- KHÔNG viết `style={{}}` inline khi có utility tương đương (đặc biệt text-shadow, gradient, height cố định → `[text-shadow:…]`, `bg-linear-to-*`, `h-[420px]`).
- KHÔNG dùng hex ngoài `@theme` (chỉ `blue-*`/`slate-*`/`gray-*` family của Tailwind hoặc token `primary-*`/`accent`).
- KHÔNG đưa palette dark/đen nguyên bản của design.md Acenda vào giao diện.
- KHÔNG dùng 11px làm text base (quá nhỏ cho web du lịch) — tối thiểu `text-xs` 12px cho metadata.
- KHÔNG dùng `primary-light` cho body text.
- KHÔNG dùng **kicker/eyebrow** (badge nhỏ chữ in hoa phía trên tiêu đề) và hình thức **glass/blur trang trí** (`backdrop-blur` chỉ để hiệu ứng cụ thể).
- KHÔNG dùng icon "AI-slop" trang trí (crown/gem/sparkle), gradient amber trên badge, chip mã số giả (TOUR001), hay hero chữ in hoa + glow toàn khung.
- KHÔNG có héo bóng màu halo quanh nút/giá (`shadow-primary/20`...), và gradient ảnh chỉ được phủ đáy chứ không phủ trùm cả khung.

## Quality Gates (QA Checklist)

- [ ] Mọi component đã dùng token `@theme` semantic (primary/accent/surface/background/foreground/muted/border/success/warning/danger/info).
- [ ] Không còn inline `style={{...}}` trong feature `tours/`.
- [ ] Hover đồng bộ (group trên card), transition `duration-150/300/500`.
- [ ] Focus-visible ring rõ trên mọi control.
- [ ] Empty state + error state + loading cho từng khu vực dữ liệu.
- [ ] Responsive: mobile drawer filter, grid 1/2/3 cột, text không tràn.
- [ ] Text tiếng Việt, format giá `vi-VN`.
- [ ] `npm run lint` + `npm run build` pass.