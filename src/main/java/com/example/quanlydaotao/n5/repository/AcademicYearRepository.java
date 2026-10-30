package com.example.quanlydaotao.n5.repository;
import com.example.quanlydaotao.n5.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface AcademicYearRepository extends JpaRepository<AcademicYear, UUID> {}