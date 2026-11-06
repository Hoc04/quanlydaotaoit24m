# Task Plan: Hoàn thiện Web Module N5 Quản Lý Đào Tạo IT24M

## 5 Bot Roles Assignment
1. **Bot 1 (Backend & Database Architecture)**: Rà soát & chuẩn hóa Entity, BaseEntity, Repository theo đúng 100% tài liệu `Phân_tích_các_bảng_dữ_liệu_Quanlydaotao_IT24M.xlsx.ods` cho Nhóm 5 (6 bảng: `academic_years`, `school_years`, `semesters`, `course_sections`, `student_course_sections`, `lecturer_course_classes`) và `students`.
2. **Bot 2 (Logic & API Validation)**: Cập nhật Controllers & Services, đảm bảo hỗ trợ đầy đủ CRUD, tìm kiếm, lọc theo trạng thái, kiểm tra tính toàn vẹn (validate sĩ số, chống trùng đăng ký học phần, liên kết khóa ngoại).
3. **Bot 3 (Frontend Web UI/UX)**: Nâng cấp toàn diện giao diện web hiện đại, chuyên nghiệp với AdminLTE 4 + Bootstrap 5:
   - Thống kê thời gian thực (Dashboard cards).
   - Đầy đủ 6 Tab cho Nhóm 5 + Tab Sinh viên.
   - Bảng hiển thị dữ liệu chi tiết, badge trạng thái, phân trang, lọc theo trạng thái, ô tìm kiếm nhanh.
   - Modal Form Thêm/Sửa trực quan với dropdown chọn liên kết dữ liệu mượt mà, không cần nhập UUID thủ công.
   - Thao tác Xem, Sửa, Đổi trạng thái, Xóa với xác nhận rõ ràng.
4. **Bot 4 (Git & GitHub Deployment)**: Kiểm tra git status, đồng bộ dữ liệu với nhánh `n5` upstream và origin, commit đầy đủ, sạch sẽ.
5. **Bot 5 (Supervisor, Testing & Quality Assurance)**: Giám sát toàn diện, build compile maven với Java 21/25, kiểm thử toàn bộ REST API, rà soát fix các lỗi edge case.

## Phases
- [x] Phase 1: Phân tích tài liệu Excel và đối chiếu codebase hiện tại
- [ ] Phase 2: Bot 1 & Bot 2 - Chuẩn hóa Backend Entity, Repository, Service, Controller
- [ ] Phase 3: Bot 3 - Thiết kế và hoàn thiện Web UI/UX cho N5
- [ ] Phase 4: Bot 5 - Kiểm thử Maven Compile, API Test, sửa lỗi phát sinh
- [ ] Phase 5: Bot 4 - Commit Git và chuẩn bị đẩy lên nhánh n5
