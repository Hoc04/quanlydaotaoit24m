package com.example.quanlydaotao.n5.service;

import com.example.quanlydaotao.n5.entity.StudentCourseSection;
import com.example.quanlydaotao.n5.entity.CourseSection;
import com.example.quanlydaotao.n5.repository.StudentCourseSectionRepository;
import com.example.quanlydaotao.n5.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class StudentCourseSectionService {
    private final StudentCourseSectionRepository repo;
    private final CourseSectionRepository csRepo;

    public StudentCourseSectionService(StudentCourseSectionRepository repo, CourseSectionRepository csRepo) {
        this.repo = repo;
        this.csRepo = csRepo;
    }

    public List<StudentCourseSection> findAll() {
        return repo.findAll();
    }

    public StudentCourseSection save(StudentCourseSection e, UUID csId) {
        if (csId != null) {
            // 1. Tìm lớp học phần
            CourseSection cs = csRepo.findById(csId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học phần!"));

            // 2. Kiểm tra trạng thái lớp (phải là Đang mở)
            if (cs.getStatus() != null && !cs.getStatus().equalsIgnoreCase("Đang mở") && !cs.getStatus().equalsIgnoreCase("open")) {
                throw new RuntimeException("Lớp học phần này hiện không mở đăng ký!");
            }

            // 3. Kiểm tra xem sinh viên đã đăng ký lớp này chưa (tránh trùng)
            if (repo.existsByStudentIdAndCourseSectionId(e.getStudentId(), csId)) {
                throw new RuntimeException("Sinh viên đã đăng ký lớp học phần này rồi!");
            }

            // 4. Kiểm tra sĩ số (chỗ còn trống)
            long currentCount = repo.countByCourseSectionId(csId);
            if (cs.getMaxStudents() != null && currentCount >= cs.getMaxStudents()) {
                throw new RuntimeException("Lớp học phần đã đầy (Tối đa: " + cs.getMaxStudents() + " chỗ)!");
            }

            // Nếu mọi thứ OK thì gán lớp và lưu
            e.setCourseSection(cs);
        }
        return repo.save(e);
    }

    public void delete(UUID id) {
        repo.deleteById(id);
    }
}