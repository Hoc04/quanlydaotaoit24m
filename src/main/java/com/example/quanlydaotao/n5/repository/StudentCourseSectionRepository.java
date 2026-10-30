package com.example.quanlydaotao.n5.repository;

import com.example.quanlydaotao.n5.entity.StudentCourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface StudentCourseSectionRepository extends JpaRepository<StudentCourseSection, UUID> {
    // Đếm số lượng sinh viên đã đăng ký lớp này
    long countByCourseSectionId(UUID courseSectionId);
    
    // Kiểm tra xem sinh viên đã đăng ký lớp này chưa (để chống trùng)
    boolean existsByStudentIdAndCourseSectionId(UUID studentId, UUID courseSectionId);
}