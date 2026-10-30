package com.example.quanlydaotao.n5.repository;

import com.example.quanlydaotao.n5.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, UUID> {
}