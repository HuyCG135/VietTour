---
name: use-case-detail-diagram
description: Use when the user asks to draw/vẽ a detailed use case diagram (biểu đồ use case chi tiết) for one function group taken from the overview use case diagram — e.g. "vẽ biểu đồ use case chi tiết Quản lý sản phẩm", "vẽ chi tiết UC Thanh toán". Draws using the draw.io MCP server, following include/extend/generalization rules and avoiding the common mistakes flagged in THAO_LUAN_PTTKHT.pdf. Not for the overview (tổng quát) diagram itself, and not for writing the text spec (that's use-case-spec skill).
version: 1.0.0
user-invocable: true
argument-hint: "Vẽ biểu đồ use case chi tiết <tên nhóm chức năng>"
---

Vẽ biểu đồ Use Case chi tiết (zoom vào 1 nhóm chức năng từ biểu đồ tổng quát) bằng MCP draw.io, theo đúng khuôn mẫu và các điểm sửa lỗi (Kiến nghị) trong `THAO_LUAN_PTTKHT.pdf`.

## Input cần có trước khi vẽ

1. Tên nhóm chức năng cần zoom chi tiết (vd "Quản lý sản phẩm", "Thanh toán", "Quản lý bài viết").
2. Actor liên quan tới nhóm chức năng đó (lấy từ biểu đồ tổng quát hoặc file `.md` ngữ cảnh nếu có).
3. Danh sách các hành vi/chức năng con bên trong nhóm đó.

Nếu thiếu 1 trong 3 mục trên, hỏi người dùng trước khi vẽ — không tự bịa nghiệp vụ.

## Bước 1 — Phân loại nhóm chức năng: 3 dạng, mỗi dạng vẽ khác nhau

Trước khi vẽ, xác định nhóm chức năng thuộc dạng nào trong 3 dạng sau (hỏi người dùng nếu không rõ):

### Dạng A — Nhóm quản lý CRUD (vd: Quản lý sản phẩm, Quản lý bài viết)
Đặc điểm: các hành vi con (Thêm/Sửa/Xóa/Tìm kiếm...) **độc lập với nhau**, không phải các cách thực hiện của cùng 1 việc.

**Cách vẽ đúng** (chọn 1 trong 2, hỏi người dùng muốn bản nào nếu không chỉ định):
- **Bản đơn giản (khuyến nghị mặc định)**: 1 UC cha duy nhất (vd "Quản Lý Sản Phẩm") nối thẳng với actor bằng association, kèm `<<include>>` Đăng Nhập nếu đăng nhập KHÔNG phải tiền điều kiện bắt buộc sẵn có (nếu đăng nhập là tiền điều kiện thì bỏ include này — theo quan điểm IBM). Đính kèm 1 note (`<<note>>`, hình góc gấp) liệt kê ngắn gọn các hành vi con bằng bullet, KHÔNG vẽ rời từng UC con.
- **Bản chi tiết (theo IBM)**: mỗi hành vi con (Thêm/Sửa/Xóa/Tìm kiếm) là 1 UC **độc lập**, nối thẳng trực tiếp tới actor bằng association riêng — KHÔNG dùng `<<extend>>` từ các UC con tới 1 UC trung gian dạng "Danh sách X".

**Lỗi cần tránh tuyệt đối**: KHÔNG vẽ kiểu "UC cha --include--> Danh Sách X <--extend-- Thêm/Sửa/Xóa/Tìm kiếm" (đây chính là lỗi bị đánh dấu "Kiến nghị: Sửa lại" trong tài liệu — dùng `<<extend>>` sai chỗ vì các hành vi CRUD không phải là mở rộng có điều kiện của việc "xem danh sách").

### Dạng B — Nhóm có nhiều cách thực hiện cùng 1 việc (vd: Thanh toán)
Đặc điểm: các nhánh con là **biến thể/phiên bản cụ thể** của cùng 1 hành vi tổng quát.

**Cách vẽ đúng**: dùng **Generalization** (mũi tên tam giác rỗng) từ mỗi UC con trỏ vào UC cha tổng quát. Vd: Thanh toán tiền mặt --|> Thanh toán, Thanh toán chuyển khoản --|> Thanh toán, Thanh toán ví điện tử --|> Thanh toán. Actor nối thẳng với UC cha tổng quát.

### Dạng C — Nhóm có bước dùng chung bắt buộc (không phải biến thể, không phải CRUD)
Đặc điểm: 1 hoặc nhiều UC trong nhóm LUÔN LUÔN cần 1 bước chung khác để hoàn thành (không phải tùy chọn).

**Cách vẽ đúng**: dùng `<<include>>`, mũi tên nét đứt hướng từ UC cha tới UC con dùng chung. Chỉ dùng khi bước đó **luôn xảy ra 100%**, không có điều kiện.

**Lưu ý quan trọng khi actor cần đăng nhập**: nếu Đăng Nhập chỉ là TIỀN ĐIỀU KIỆN (đã đăng nhập từ trước khi vào chức năng) thì KHÔNG vẽ `<<include>>` Đăng Nhập nữa (đây là quan điểm IBM được nêu rõ trong tài liệu, tránh vẽ thừa).

## Bước 2 — Nếu có hành vi tùy chọn (không bắt buộc), dùng `<<extend>>`

Chỉ dùng `<<extend>>` khi hành vi đó **có thể có hoặc không**, không ảnh hưởng tới việc UC chính vẫn hoàn thành được. Mũi tên nét đứt hướng từ UC mở rộng (con) tới UC gốc (cha). Ví dụ đúng trong tài liệu: Áp Mã Giảm Giá `<<extend>>` Thanh Toán; In Hóa Đơn `<<extend>>` Rút Tiền.

## Bước 3 — Bảng quyết định nhanh (dùng khi phân vân chọn quan hệ nào)

| Câu hỏi | Nếu CÓ | Nếu KHÔNG |
|---|---|---|
| Hành vi này luôn luôn phải xảy ra? | `<<include>>` | Xét tiếp câu dưới |
| Hành vi này chỉ xảy ra khi có điều kiện/lựa chọn? | `<<extend>>` | Xét tiếp câu dưới |
| Đây có phải 1 phiên bản cụ thể của actor/UC khác (is-a)? | Generalization | Đây là 2 UC độc lập → association riêng, không nối quan hệ nào giữa chúng |

## Bước 4 — Vẽ bằng MCP draw.io

1. Nếu có sẵn file `.md` mô tả biểu đồ tổng quát (từ các cuộc trò chuyện/skill khác), đọc lại để lấy đúng tên actor, use case, không tự đặt tên khác.
2. Nếu MCP draw.io có tool `search_shapes`, ưu tiên tìm shape UML use case/actor chuẩn thay vì tự vẽ.
3. Vẽ actor bằng ký hiệu stick figure UML chuẩn, use case bằng hình oval, hệ thống bao bằng khung chữ nhật có tên hệ thống ở trên (giống style "He Thong Ban Hang" trong tài liệu).
4. Ghi nhãn quan hệ đúng stereotype: `<<include>>`, `<<extend>>` (chữ thường, có dấu ngoặc kép nhọn), generalization thì KHÔNG có nhãn chữ, chỉ có mũi tên tam giác rỗng.
5. Nếu dùng note, vẽ hình chữ nhật có góc trên phải gấp lại (UML note shape), nối bằng đường nét đứt không mũi tên tới UC liên quan.
6. Xuất ra file `.drawio` để người dùng mở lại chỉnh sửa.

## Ví dụ tham khảo từ tài liệu (dùng làm mẫu đối chiếu)

- **Quản lý sản phẩm / Quản lý bài viết** → Dạng A, bản "Kiến nghị: Sửa lại" là ví dụ chuẩn (không dùng extend sai chỗ).
- **Thanh toán** (Thanh toán tiền mặt/thẻ tín dụng/ví điện tử) → Dạng B, bản "Kiến nghị: Giữ nguyên" là ví dụ chuẩn (dùng generalization đúng).
- **Hệ thống ATM** (Rút tiền/Chuyển khoản/Xem số dư đều include Kiểm tra PIN) → Dạng C mẫu include chuẩn.
- **Rút tiền extend In Hóa Đơn** → mẫu extend chuẩn (hành vi tùy chọn).

## Qui trình khi có yêu cầu

1. Hỏi/xác nhận: tên nhóm chức năng, actor liên quan, danh sách hành vi con (nếu người dùng đưa file `.md` ngữ cảnh sẵn thì đọc từ đó).
2. Xác định nhóm thuộc Dạng A, B, hay C (hỏi nếu chưa rõ, không tự đoán khi có khả năng gây sai quan hệ).
3. Nếu Dạng A, hỏi người dùng muốn bản đơn giản (note) hay bản chi tiết (IBM, tách UC con) — mặc định đề xuất bản đơn giản nếu không có ý kiến.
4. Vẽ bằng MCP draw.io theo đúng bước 4.
5. Xuất file `.drawio`, present cho người dùng.