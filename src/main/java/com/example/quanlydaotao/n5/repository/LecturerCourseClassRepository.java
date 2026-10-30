package com.example.quanlydaotao.n5.repository;
import com.example.quanlydaotao.n5.entity.LecturerCourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface LecturerCourseClassRepository extends JpaRepository<LecturerCourseClass, UUID> {}