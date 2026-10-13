---
name: sequence-diagram
description: >-
  Use when the user asks to draw or create a UML sequence diagram (biểu đồ trình tự / biểu đồ tuần tự / sequence diagram) for a system flow — e.g. "vẽ biểu đồ trình tự đăng nhập", "vẽ sequence diagram đặt tour", "vẽ biểu đồ tuần tự thanh toán". Produces an editable .drawio file rendered in the draw.io editor using native UML shapes (actor/boundary/control/entity lifelines, activation bars, sync/async/return messages, combined fragments alt/opt/loop/par/ref). Style matches the user's sample in trinhtu.drawio.
---

# Sequence Diagram (Biểu Đồ Trình Tự)

Vẽ biểu đồ **trình tự (sequence diagram)** bằng MCP draw.io, theo đúng chuẩn **UML 2.5 (OMG, phần Interactions)** và giữ **phong cách mẫu** của user trong `D:\VietTour\trinhtu.drawio`.

## Mục đích chính

- Output là **tab mới trong `D:\VietTour\trinhtu.drawio`** (file **nhiều tab**, mỗi use case = 1 tab `<diagram id="..." name="...">`): thêm khối `<diagram>` mới vào file, user tự mở trong draw.io để **sửa từng thành phần** (kéo message, resize frame, sửa chữ). Không tạo file `.drawio` rời.
- Mỗi lifeline / activation bar / message / frame là **một cell draw.io riêng** — user bấm vào là thấy được, chỉnh được.
- Style bám khớp mẫu `trinhtu.drawio`: `strokeWidth=1.5`, màu `default`, tiêu đề lifeline bằng text cell, mũi tên yêu cầu = nét đặc đầu bịt kín (`endArrow=block`), mũi tên phản hồi = nét đứt đầu hở (`endArrow=open;dashed=1`).

## Lưu trữ: các tab trong `trinhtu.drawio` (đọc trước khi vẽ)

`trinhtu.drawio` là file nhiều tab — Khi thêm use case mới **phải chèn tab mới, giữ nguyên các tab cũ** (user thường tự chỉnh tay các tab trên đĩa — không được sửa tab khác).

**Catalog tab hiện có:**
| Tab id | Tên | Các lifeline |
|---|---|---|
| `sd-timkiem-tour` | Trình tự Tìm kiếm tour | Tác nhân, Giao diện, Điều khiển, Database |
| `sd-xem-tour` | Trình tự Xem tour | Khách xem, DS Tour, Chi tiết Tour, Điều khiển, Database |
| `sd-dat-tour` | Trình tự Đặt tour | Khách hàng, Chi tiết Tour, Đặt Tour, Thanh toán, Đăng nhập, Điều khiển, Database |
| `sd-thanh-toan` | Trình tự Thanh toán | Khách hàng, Thanh toán, Điều khiển, Database, VNPay, Email |
| `sd-tra-cuu-chatbot` | Trình tự Tra cứu Chatbot | Khách xem/Khách hàng, Trợ lý du lịch, Điều khiển, Database, Model Qwen 2.5 (Ollama) — **user sửa tay, đừng động vào** |
| `sd-danh-sach-yeu-thich` | Trình tự Danh sách yêu thích | Khách Hàng, DS yêu thích, DS Tour, Đăng nhập, Điều khiển, Database |

**Thao tác trên file:**
- Đọc 1 tab: `drawio_get_page(path, page=<tab-id>)` — trả `<mxGraphModel>` của tab đó.
- Liệt kê tab: `drawio_list_pages(path)` — chạy trước khi thêm để lấy id/name mới; verify sau khi chèn.
- **Thêm tab mới**: chèn khối `<diagram id="<ten-tab>" name="Trình tự <Tên>"><mxGraphModel ...>...</mxGraphModel></diagram>` ngay trước `</mxfile>` bằng Edit tool. Sau khi chèn, verify lại `drawio_list_pages`.
- id cell trong tab nên đặt **prefix riêng của tab** (vd `FV_`, `TT_`, `CH_` — tab đang dùng) để tránh nhầm khi so nội dung. `pageWidth=1300`; `pageHeight` đặt đủ chứa hết diagram (~1800–2200).

## Quy tắc chuẩn (UML 2.5) — bắt buộc tuân thủ

1. **Lifeline**: nét dọc, tiêu đề "Tên" hoặc "Tên:Kiểu". Trong đồ án dùng các kiểu mặc định: **actor** (Người quản lí/Khách hàng/Khách xem), **boundary** (Giao diện cụ thể), **control** (Điều khiển/Controller), **entity** (Database/Model). 
   - ⚠️ **Tên Giao diện (Boundary) phải ghi rõ tên màn hình cụ thể từ codebase**: Tra cứu code frontend (`frontend/src/features/...` & `pages/`) để ghi rõ tên giao diện (vd: `Giao diện Danh sách Tour`, `Giao diện Chi tiết Tour`, `Giao diện Đặt tour`, `Giao diện Đăng nhập`...). Không ghi chung chung là "Giao diện".
   - ⚠️ **Nhiều Giao diện khi chuyển màn hình**: Nếu luồng use case đi qua nhiều màn hình (vd: click tour từ danh sách chuyển qua trang chi tiết), phải tạo đủ các Boundary Lifeline tương ứng (`Giao diện Danh sách Tour` -> `Giao diện Chi tiết Tour`).
   - ⚠️ **Gộp luồng liên tiếp / trùng hợp**: Gom các bước xử lý liên tiếp hoặc các tương tác hiển thị thông tin đi kèm (vd: tải thông tin chi tiết tour + danh sách đánh giá) thành 1 luồng response tổng hợp thay vì vẽ rời rạc lặp lại.
   - Số lifeline **không cố định là 4** — thêm/bớt theo luồng thực tế đã chốt (nhiều giao diện, nhiều controller/service, thêm participant cho dịch vụ bên ngoài).
2. **Message**: luôn vẽ **ngang hoặc xiên xuống** từ sender đến receiver (không bao giờ đi lên).
   - Yêu cầu đồng bộ (chờ kết quả): nét đặc, **mũi tên bịt kín**.
   - Bất đồng bộ (không chờ): nét đặc, **mũi tên hở** (`endArrow=open`).
   - Phản hồi/trả kết quả: **nét đứt, mũi tên hở** (`dashed=1;endArrow=open`).
3. **Activation bar**: thanh mảnh trên lifeline, kéo dài từ khi nhận message đầu tiên tới khi trả hết message liên quan — thể hiện "đang xử lý". Thêm cho boundary/control/entity mỗi khi chúng nhận call.
4. **Combined fragment** (khối trong frame): `umlFrame` — `alt` (rẽ nhánh), `opt` (tùy chọn hoặc không xảy ra), `loop` (lặp, guard ghi điều kiện/hoặc số lần `loop(min, max)`), `par` (song song), `break`, `ref` (gọi luồng khác).
   - Mỗi operand trong frame: **guard** dạng `[điều kiện]` đặt góc trên-trái, các operand **phân cách bằng nét đứt ngang**.
   - Operand sau cùng của `alt` khi không khớp điều kiện nào dùng guard `else`.
5. **Self-message / gọi lại nội bộ** (tự xử lý nội bộ: sinh mã, kiểm tra cache...): dùng ký hiệu chuẩn UML 2.5 — một **activation bar lồng (nested)** đặt trên cột lifeline đúng thời điểm gọi, kèm mũi tên ngắn `edgeStyle=orthogonalEdgeStyle;endArrow=block` từ lifeline cắm xuống bar lồng đó. **KHÔNG** vẽ dạng vòng lặp 2 waypoint rời (kiểu cũ — đã thay).
6. **Guard/điều kiện** luôn trong ngoặc vuông `[...]` (mẫu trinhtu.drawio ghi "Invalid/Valid" không ngoặc — chỉ làm theo nếu user yêu cầu bản khớp 100% mẫu).
7. Trước khi vẽ: nếu chưa rõ luồng thực tế của chức năng thì **đọc code** (backend feature + frontend page tương ứng) hoặc **hỏi user** — không tự bịa nghiệp vụ.

## Bước 1 — Chốt kịch bản & danh sách lifeline

Hỏi/đọc để có:
1. Tên luồng chức năng (vd "Đăng nhập", "Đặt tour", "Thanh toán VNPay").
2. Danh sách lifeline và **thứ tự trái → phải**: actor → boundary (Giao diện) → control (Điều khiển) → entity (Database) → các service ngoài (payment gateway, email...) cuối cùng.
3. Các message chính (mượn từ đặc tả use case nếu đã có — skill use-case-spec).

Không cần hỏi lại khi user đã mô tả đầy đủ kịch bản trong yêu cầu.

## Bước 2 — Chọn cách vẽ

| Tình huống | Cách vẽ |
|---|---|
| Cần file tinh chỉnh từng cell, đúng style mẫu (mặc định) | **XML** (`open_drawio_xml`) — theo template dưới |
| Chỉ cần bản nháp nhanh để duyệt ý tưởng | **Mermaid** (`open_drawio_mermaid`, kiểu `sequenceDiagram`) |

Nếu không chắc, mặc định **XML** (vì user cần tự sửa component trong draw.io và giữ style mẫu).

## Bước 3 — Vẽ bằng XML (mặc định)

### 3.1. Bố trí cột lifeline

- Chọn tâm cột cho mỗi lifeline: `cx` cách nhau ~160–220px (bắt đầu `cx=180` cho actor, tăng dần).
- Lifeline cell đặt tại `x = cx − W/2`. Chiều rộng `W` theo kiểu mẫu:

| Kiểu | `participant=` | `W` |
|---|---|---|
| Actor | `umlActor` | 20 |
| Boundary | `umlBoundary` | 50 |
| Control | `umlControl` | 40 |
| Entity | `umlEntity` | 40 |
| External/dịch vụ ngoài | `participant=umlEntity` (đổi label cho rõ) | 40 |

- Vị trí dọc: **header text ở `y=30–50` (cao 30), lifeline bắt đầu `y=60–80`** — theo layout các tab mới hơn (Đặt tour, Thanh toán, Chatbot, Favorites). Tab mẫu cũ Tìm kiếm dùng `y=160/190` nhưng các tab mới không theo nữa. `height` lifeline >= đáy message cuối + 60 (mỗi tab tự chọn, thường 1280–1900).
- Activation bar là **child của lifeline**, tọa độ tương đối: `x = (W−10)/2`, `y = yMessageTop − lifelineY`, `height = yMessageBottom − yMessageTop`.

### 3.2. Template cell (copy nguyên style, chỉ đổi tọa độ/giá trị)

**Header text** (PHP-style `html=1`):
```xml
<mxCell id="H_ACTOR" parent="1" style="text;html=1;align=center;verticalAlign=middle;resizable=0;points=[];autosize=1;strokeColor=none;fillColor=none;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="Người quản lí" vertex="1">
  <mxGeometry height="30" width="90" x="135" y="160" as="geometry"/>
</mxCell>
```
(Căn giữa: `x = cx − textWidth/2`, `width = textWidth + 20`.)

**Lifeline**:
```xml
<mxCell id="L_CTRL" parent="1" style="shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;container=1;dropTarget=0;collapsible=0;recursiveResize=0;outlineConnect=0;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};participant=umlControl;strokeWidth=1.5;" value="" vertex="1">
  <mxGeometry x="540" y="190" width="40" height="400" as="geometry"/>
</mxCell>
```

**Activation bar** (parent = lifeline):
```xml
<mxCell id="A_CTRL" parent="L_CTRL" style="html=1;points=[[0,0,0,0,5],[0,1,0,0,-5],[1,0,0,0,5],[1,1,0,0,-5]];perimeter=orthogonalPerimeter;outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="" vertex="1">
  <mxGeometry x="15" y="90" width="10" height="240" as="geometry"/>
</mxCell>
```

**Message — yêu cầu đồng bộ** (nét đặc, đầu bịt kín):
```xml
<mxCell id="M1" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=block;curved=0;rounded=0;strokeColor=default;align=center;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="Nhập tài khoản, mật khẩu">
  <mxGeometry relative="1" width="80" as="geometry">
    <mxPoint x="180" y="330" as="sourcePoint"/>
    <mxPoint x="365" y="330" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

**Message — phản hồi/return** (nét đứt, đầu hở):
```xml
<mxCell id="M2" edge="1" parent="1" style="html=1;verticalAlign=bottom;endArrow=open;dashed=1;endSize=8;curved=0;rounded=0;strokeColor=default;align=center;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="Hiển thị giao diện">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="365" y="300" as="sourcePoint"/>
    <mxPoint x="180" y="300" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

**Self-message — activation bar lồng + mũi tên tự gọi** (chuẩn UML, đúng bản user đã sửa trong tab Thanh toán):

```xml
<!-- Bar lồng: đặt đúng cột lifeline (center) tại thời điểm bắt đầu xử lý nội bộ.
     Nếu nằm trong frame → parent = frame, tọa độ tương đối; không có frame → parent = 1, tọa độ tuyệt đối. -->
<mxCell id="A_SELF" parent="F_ALT" style="html=1;points=[[0,0,0,0,5],[0,1,0,0,-5],[1,0,0,0,5],[1,1,0,0,-5]];perimeter=orthogonalPerimeter;outlineConnect=0;targetShapes=umlLifeline;portConstraint=eastwest;newEdgeStyle={&quot;curved&quot;:0,&quot;rounded&quot;:0};" value="" vertex="1">
  <mxGeometry height="40" width="10" x="460" y="130" as="geometry"/>
</mxCell>
<!-- Mũi tên tự gọi: nét đặc đầu bịt kín, edgeStyle=orthogonalEdgeStyle, target = bar lồng.
     sourcePoint đặt trên lifeline (phía trên bar lồng), 1 waypoint duy nhất ra phải rồi cắm xuống bar. -->
<mxCell id="M3" edge="1" parent="F_ALT" style="html=1;align=left;spacingLeft=2;endArrow=block;edgeStyle=orthogonalEdgeStyle;" target="A_SELF" value="3. Tạo liên kết VNPay / Tự xử lý">
  <mxGeometry relative="1" as="geometry">
    <Array as="points">
      <mxPoint x="495" y="140"/>
    </Array>
    <mxPoint x="465" y="110" as="sourcePoint"/>
  </mxGeometry>
</mxCell>
```

Quy ước tọa độ (ví dụ bar rộng 10, center cột lifeline = `cx`): `x_bar = cx_fr − 5`, `sourcePoint = (cx_fr, bar.y − 20)`, `waypoint = (cx_fr + 35, bar.y + 10)`, `height_bar = thời gian xử lý nội bộ` (khoảng 40). Mỗi lần tự gọi lại = **1 bar lồng mới** nối tiếp (bar này thay cho việc kéo dài nét đứng của bar chính). Các message liên lifeline bình thường vẫn theo rule 3.3 (parent="1", tọa độ tuyệt đối) — chỉ riêng bar lồng + mũi tên tự gọi là con của frame khi nằm trong frame.

> Quy ước tọa độ: với message ngang ở mức `Y`, dùng `sourcePoint=(cx_sender, Y)` và `targetPoint=(cx_receiver, Y)`, giãn các mức `Y` cách nhau **36–50px** theo thứ tự thời gian. Không để 2 message cùng `Y` cắt nhau.

### 3.3. Combined fragment (alt / opt / loop / par / break / ref)

Template frame `alt` (mẫu y như trinhtu.drawio — 2 operand):
```xml
<mxCell id="F_ALT" parent="1" style="shape=umlFrame;whiteSpace=wrap;html=1;pointerEvents=0;recursiveResize=0;container=1;collapsible=0;width=120;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;height=30;strokeWidth=1.5;" value="alt" vertex="1">
  <mxGeometry x="90" y="390" width="680" height="200" as="geometry"/>
</mxCell>
<mxCell id="G1" parent="F_ALT" style="text;html=1;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="[điều kiện 1]" vertex="1">
  <mxGeometry height="20" relative="1" width="100" as="geometry">
    <mxPoint x="20" y="40" as="offset"/>
  </mxGeometry>
</mxCell>
<mxCell id="SEP1" parent="F_ALT" style="line;strokeWidth=1.5;dashed=1;labelPosition=center;verticalLabelPosition=bottom;align=left;verticalAlign=top;spacingLeft=20;spacingTop=15;html=1;whiteSpace=wrap;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;" value="else" vertex="1">
  <mxGeometry height="10" width="640" y="100" as="geometry"/>
</mxCell>
<mxCell id="G2" parent="F_ALT" style="text;html=1;fontFamily=Helvetica;fontSize=11;fontColor=default;labelBackgroundColor=default;strokeWidth=1.5;" value="[điều kiện 2]" vertex="1">
  <mxGeometry height="20" relative="1" width="100" as="geometry">
    <mxPoint x="20" y="140" as="offset"/>
  </mxGeometry>
</mxCell>
```

Quy ước frame:
- Frame phủ **từ lifeline trái nhất tới phải nhất** trong đoạn message của nó: `x = cxMin − 90`, `width = (cxMax − cxMin) + 180`, `y = yMinMessage − 40`, `height = yMaxMessage − yMinMessage + 70`.
- Guardian đặt góc trên-trái mỗi operand, dạng `[điều kiện]`; operand cuối `alt` là `else`.
- Nét phân cách operand: `style=line;...;dashed=1`, width = frame width − 40, `y` = vị trí ngăn cách.
- Message nằm trong frame: vẫn vẽ với source/target là **tọa độ tuyệt đối** của lifeline đang dùng (có `parent="1"`, không gán parent frame), y trong `[frame.y, frame.y+frame.height]`.

**Pattern "bám sát bảng đặc tả UC" (nhiều luồng phụ A1..A5)**: dùng **1 frame `alt` lớn** bọc gần như toàn bộ diagram:
- Operand 1 (trên cùng): guard `[Thao tác thành công]`/`[Điều kiện tiên quyết & hợp lệ]` chứa luồng chính (các message đánh số `1., 2., 3a., 4.` theo mô tả UC).
- Mỗi luồng phụ = 1 nhánh `else` riêng, phân cách bởi nét đứt, guard ghi `[A1. Tên luồng] (bước n)`. Message trong nhánh phụ đặt tên `A1-1, A1-2, ...` tương ứng từng bước trong mô tả luồng phụ.
- Frame + các guard gán `parent=F_MAIN`, separator `parent=F_MAIN`; nhưng **message + activation bar dùng tọa độ tuyệt đối `parent="1"`** y theo frame.y.
- Xem mẫu chuẩn ở tab `sd-danh-sach-yeu-thich` (6 lifeline, 1 frame alt lớn + 4 nhánh else A1/A2/A3-A4/A5) hoặc `sd-dat-tour` (nhiều giao diện chuyển màn hình).

### 3.4. Note, ref, sd-frame (khi cần)

- **Note** (giải thích nghiệp vụ): `style="shape=note;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"`, nối bằng nét đứt không mũi tên (`dashed=1`) tới lifeline/message liên quan.
- **ref**: frame value `ref`, label bên trong ghi tên luồng được gọi.
- **sd** (bọc cả biểu đồ khi báo cáo cần frame ngoài, tùy chọn): frame value `sd <Tên luồng>`.

### 3.5. Luồng lỗi / trường hợp tổng quát lỗi

Diagram phải thể hiện được luồng lỗi, không chỉ happy path. Quy ước:

- **Gom chung thành 1 nhánh lỗi tổng quát** thay vì tách lẻ từng loại lỗi: trong `alt` bao quanh đoạn xử lý, thêm nhánh cuối guard `[có lỗi]`/`[lỗi hệ thống/mạng]` (hoặc `else`), trong đó vẽ chuỗi phản hồi nét đứt: nơi phát lỗi (thường Database/Control) → Control → Boundary → Actor với thông báo lỗi, kết thúc bằng "giữ nguyên trang/giao diện".
  ```
  [có kết quả]
     ...luồng bình thường...
  else [có lỗi hệ thống/mạng]
     DB --> DK: Thông báo lỗi truy vấn
     DK --> GD: Báo lỗi
     GD --> Actor: Thông báo lỗi, giữ nguyên trang
  ```
- Nếu lỗi chỉ xảy ra ở 1 bước lặp (vd poll): đặt `opt [có lỗi]` ngay trong `loop`/sau bước đó.
- Chỉ vẽ lỗi đã có trong đặc tả/code — nếu không rõ thì hỏi user, không tự bịa thêm loại lỗi mới.
- Không bắt buộc mọi UC đều có nhánh lỗi trên diagram: nếu luồng phụ chỉ là "hủy/thoát", có thể bỏ qua.

## Bước 4 — Vẽ bằng Mermaid (bản nháp nhanh)

Dùng `open_drawio_mermaid` với kiểu `sequenceDiagram`. Bản dịch mẫu đăng nhập (khớp 4 lifeline của mẫu cũ):

```mermaid
sequenceDiagram
  actor NQL as Người quản lí
  boundary GD as Giao diện
  control DK as Điều khiển
  entity DB as Database
  NQL->>GD: Chọn chức năng đăng nhập
  GD-->>NQL: Hiển thị giao diện
  NQL->>GD: Nhập tài khoản, mật khẩu
  GD->>DK: Yêu cầu kiểm tra
  DK->>DB: Kiểm tra
  DB-->>DK: Kết quả
  alt Sai thông tin
    DK-->>GD: Thông báo thất bại
  else Thành công
    DK-->>GD: Thông báo thành công và đổi giao diện
  end
```

Từ điển cú pháp:
- Khai báo: `actor X as Nhãn`, `participant X as Nhãn`, `boundary X as Nhãn`, `control X as Nhãn`, `entity X as Nhãn`, `database X as Nhãn`.
- Gửi đồng bộ: `A->>B: msg` (hoặc `->` nét mảnh). Bất đồng bộ: `A-)B: msg`. Phản hồi: `A-->>B: msg` (nét đứt đầu mũi tên).
- Activation: `A->>+B: msg` ... `B-->>-A: return` (thêm `+`/`-` để bật/tắt thanh activation).
- Fragments: `alt ... else ... end`, `opt ... end`, `loop <điều kiện> ... end`, `par ... and ... end`, `break ... end`.
- Note: `Note over A,B: nội dung`. Self-message: `A->>A: msg`.
- Nếu draw.io render kiểu `boundary/control/entity` không đúng (một số bản mermaid cũ), dùng `participant X as Nhãn` thay, rồi kể cho user biết.

> Khi nào dùng Mermaid: user chỉ cần duyệt nhanh ý tưởng. Nếu user muốn chỉnh từng cell hoặc giữ style mẫu → làm lại bằng XML (Bước 3).

## Quy trình khi có yêu cầu

1. Đọc yêu cầu: tên luồng, actor, các thành phần tham gia, message (đọc code/đặc tả use case nếu cần — xem skill use-case-spec, không bịa).
2. Chọn cách vẽ: mặc định **XML**; Mermaid nếu user nói nháp nhanh.
3. Dựng danh sách lifeline theo thứ tự actor → boundary → control → entity → service ngoài.
4. Vẽ bằng MCP theo XML (Bước 3) hoặc Mermaid (Bước 4), gom nhánh lặp/điều kiện vào frame `loop`/`alt`/`opt` đúng chỗ.
5. **Chèn vào `trinhtu.drawio`**: thêm khối `<diagram>` mới trước `</mxfile>` (giữ nguyên tab cũ — xem mục Lưu trữ ở trên), sau đó verify bằng `drawio_list_pages` rồi `drawio_get_page` kiểm tra nội dung tab vừa thêm.
6. Giao cho user: báo vị trí/đã mở editor draw.io (hoặc việc tự mở tab trong file), kể ngắn gọn các thành phần đã vẽ để user dễ kiểm tra.