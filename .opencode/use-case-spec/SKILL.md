---
name: use-case-spec
description: Use when the user asks to write, review, or refine a use case description (đặc tả / kịch bản use case) for the PTTKHT report — e.g. "viết đặc tả use case tìm kiếm tour", "mô tả use case đặt tour", "soạn kịch bản UC theo mẫu thầy". Produces Vietnamese use case specs in the exact table format from THAO_LUAN_PTTKHT.pdf (Tên UC / Actor / Tiền điều kiện / Hậu điều kiện / Mô tả / Luồng sự kiện chính / Luồng sự kiện phụ). Not for UML diagram notation questions outside a written spec.
version: 1.1.0
user-invocable: true
argument-hint: "[Viết|Soạn|Review] kịch bản use case <tên>"
---

Viết kịch bản (đặc tả) use case cho đồ án — theo đúng khuôn mẫu thầy Lê Trung Kiên trong `THAO_LUAN_PTTKHT.pdf` (trang 13-17). Output là bảng markdown bằng **Tiếng Việt**; giữ nguyên thuật ngữ và thứ tự các trường.

## Cấu trúc kịch bản (thứ tự bắt buộc)

| Trường | Nội dung |
|---|---|
| **Tên UC** | Tên chức năng, ngắn gọn |
| **Actor** | Các tác nhân tham gia (phân tách bằng dấu phẩy) |
| **Tiền điều kiện** | Điều kiện bắt buộc trước khi UC chạy |
| **Hậu điều kiện** | Trạng thái hệ thống sau khi UC hoàn thành (thành công) |
| **Mô tả** | 1 câu tóm tắt chức năng |
| **Luồng sự kiện chính** | Đánh số 1..n; bước cuối ghi trạng thái cuối. Nếu có nhánh lớn → xem 2 kiểu tách nhánh ở mục "Trường hợp vs UC con" bên dưới |
| **Luồng sự kiện phụ** | Ký hiệu A1, A2, ...; mỗi mục bắt đầu bằng "Tại bước X ...", liệt kê lỗi + cách xử lý, kết bằng hướng xử lý tiếp theo (quay lại bước nào, hoặc dừng/hủy luồng) |

## Quy tắc viết

- **Luồng sự kiện chính** = chuỗi bước phải xảy ra 100% để UC thành công; bỏ các nhánh tùy chọn/điều kiện (chúng là "Trường hợp", "UC con", hoặc "Luồng sự kiện phụ").
- **Mỗi bước giao nhau**: 1 bước = 1 tác nhân hoặc 1 hành động hệ thống. Mô tả cụ thể dữ liệu nhập (liệt kê field bằng gạch đầu dòng con).
- **Luồng sự kiện phụ** = ngoại lệ, lỗi, hoặc lựa chọn hủy. Luôn ghi rõ điểm xảy ra ("Tại bước X"), thông báo hệ thống, và hướng xử lý tiếp theo sau khi xử lý (không bắt buộc luôn phải là "quay lại bước Y" — có thể là dừng/hủy giao dịch tùy ngữ cảnh).
- **Đầu ra dạng văn bản thuần**: kết quả để chèn vào Word nên viết như đoạn văn (tách bước bằng xuống dòng + số "**1.** "), tránh phụ thuộc thẻ HTML, bảo dấu bullet "•" và giữ format trong cột bảng.
- **Luồng sự kiện phụ ghi gộp**: khi nhiều bước cùng 1 lỗi → gộp 1 mục (vd "Tại bước 4 hoặc bước 7: thông báo 'Không có dữ liệu'") thay vì tách thành nhiều mục nhỏ.
- **Có thể nhắc tên UC khác trong luồng**: theo đúng văn phong gốc của thầy, được phép viết "hệ thống thực hiện Use Case Đăng Nhập" khi luồng cần rẽ sang 1 UC khác (không bắt buộc phải diễn giải lại từng bước con của UC đó tại chỗ).
- **Liên hệ với diagram**: nếu 1 bước bắt buộc dùng chung (`<<include>>`), vẫn ghi bước đó bình thường trong luồng chính (không cần include thêm UC Đăng nhập khi đăng nhập chỉ là tiền điều kiện — theo quan điểm IBM thầy dẫn). Chỉ đưa vào luồng chính những thứ thuộc UC này.
- **Độ dài Mô tả/Hậu điều kiện**: Mô tả mặc định 1-2 câu ngắn gọn; Hậu điều kiện nêu rõ trạng thái + dữ liệu hiển thị sau UC. Nếu user muốn chi tiết hơn thì kể thêm nội dung màn hình; nếu muốn ngắn hơn thì rút về 1 câu bao quát.
- **Bước gộp hợp lý**: các bước hệ thống liền nhau (hiển thị danh sách + phân trang) có thể gộp thành 1 bước nếu diễn đạt gọn và không mất tầng kiểm soát.

## Trường hợp vs UC con — 2 kiểu tách nhánh khác nhau, không dùng lẫn lộn

Tài liệu gốc của thầy có **2 cơ chế tách nhánh riêng biệt**, cần phân biệt rõ khi viết:

### A. "Trường hợp" — các cách thực hiện khác nhau của CÙNG một luồng
Dùng khi UC rẽ tại 1 điểm chung thành nhiều phương thức thực hiện (vd UC Thanh Toán: chọn phương thức thẻ/tiền mặt/ví điện tử tại bước 8).
- Viết thành "**Trường hợp 1: ...**", "**Trường hợp 2: ...**", mỗi trường hợp có luồng riêng đầy đủ.
- **Cách đánh số linh hoạt theo từng UC** — không có rule cứng, cân nhắc 1 trong 2 cách:
  - *Đánh số tiếp nối* từ bước cuối của luồng chung (như ví dụ mẫu UC Thanh Toán: chung 1→8, mỗi Trường hợp bắt đầu lại từ 9) — phù hợp khi các bước chung ở trên vẫn cần được hiểu là "đã xảy ra trước" trường hợp rẽ nhánh.
  - *Reset về 1* cho mỗi Trường hợp — phù hợp khi muốn từng Trường hợp đọc độc lập, dễ theo dõi riêng lẻ mà không cần nhớ số bước chung phía trên.
  - Khi viết 1 UC cụ thể, chọn 1 cách và áp dụng nhất quán cho tất cả Trường hợp trong UC đó; nếu người dùng không chỉ định, mặc định theo kiểu đánh số tiếp nối (giống ví dụ mẫu Thanh Toán trong tài liệu).

### B. "Các UC con" — các hành vi ĐỘC LẬP được nhóm chung trong 1 UC cha
Dùng khi UC cha là một nhóm chức năng quản lý (CRUD), mỗi hành vi con không phụ thuộc thứ tự với nhau (vd UC Quản Lý Sản Phẩm: Thêm/Sửa/Xóa/Tìm kiếm sản phẩm).
- Mỗi UC con là 1 khối **luồng riêng, tự đánh số lại từ 1**, hoàn toàn tách biệt khỏi số bước của luồng chính phía trên (không đánh số tiếp nối).
- Luồng chính của UC cha chỉ mô tả bước chọn chức năng con (vd "Nhân viên lựa chọn một trong các chức năng: Thêm/Sửa/Xóa/Tìm kiếm") + bước đăng nhập nếu cần, rồi liệt kê "Các UC con:" bên dưới.
- Có thể đơn giản hóa bằng 1 note `<<Note>>` liệt kê ngắn gọn các UC con thay vì viết luồng chi tiết cho từng cái, nếu người dùng chỉ cần bản tóm tắt nhanh (xem ví dụ "Kiến nghị: Sửa lại" của UC Quản lý bài viết/sản phẩm trong tài liệu — dùng note thay vì luồng đầy đủ).

**Cách chọn A hay B khi viết 1 UC mới**: hỏi "các nhánh này có phải các bước con của cùng 1 hành động không (A), hay là các chức năng độc lập không liên quan tới nhau (B)?" — nếu không chắc, hỏi người dùng trước khi viết.

## Qui trình khi có yêu cầu

1. Xác định UC (thường là 1 chức năng của VietTour). Nếu chưa rõ luồng thực tế, đọc code hoặc hỏi user cho chắc — đừng bịa nghiệp vụ.
2. Nếu UC có nhiều nhánh, xác định đây là "Trường hợp" (A) hay "Các UC con" (B) theo mục trên; nếu không rõ, hỏi người dùng.
3. Nếu chọn "Trường hợp" và người dùng không chỉ định cách đánh số, mặc định đánh số tiếp nối từ luồng chung.
4. Viết bảng kịch bản theo cấu trúc trên.
5. Giao kết quả trực tiếp trong chat để user chèn vào Word/báo cáo — **không** lưu kết quả từng UC vào file skill này.

## Ví dụ tham khảo (từ tài liệu thầy)

UC **Thanh toán** (trang 13-14) minh họa kiểu "Trường hợp" (đánh số tiếp nối 1-8 rồi mỗi Trường hợp từ 9). UC **Quản lý sản phẩm** (trang 15-17) minh họa kiểu "Các UC con" (Thêm/Sửa/Xóa/Tìm kiếm sản phẩm, mỗi UC con tự đánh số từ 1, tách biệt khỏi luồng chính).