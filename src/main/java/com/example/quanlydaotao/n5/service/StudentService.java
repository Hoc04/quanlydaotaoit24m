package com.example.quanlydaotao.n5.service;

import com.example.quanlydaotao.n5.entity.Student;
import com.example.quanlydaotao.n5.repository.StudentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) { this.repo = repo; }
    
    public List<Student> findAll() { return repo.findAll(); }
    public Student save(Student s) { return repo.save(s); }
    public void delete(UUID id) { repo.deleteById(id); }
}