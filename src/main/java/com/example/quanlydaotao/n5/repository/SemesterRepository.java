package com.example.quanlydaotao.n5.repository;
import com.example.quanlydaotao.n5.entity.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;
public interface SemesterRepository extends JpaRepository<Semester, UUID> {
    List<Semester> findBySchoolYearId(UUID schoolYearId);
}