package com.example.quanlydaotao.n5.repository;
import com.example.quanlydaotao.n5.entity.SchoolYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface SchoolYearRepository extends JpaRepository<SchoolYear, UUID> {}