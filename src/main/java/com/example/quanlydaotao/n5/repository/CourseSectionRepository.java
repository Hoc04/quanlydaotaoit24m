package com.example.quanlydaotao.n5.repository;
import com.example.quanlydaotao.n5.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    List<CourseSection> findBySemesterId(UUID semesterId);
}