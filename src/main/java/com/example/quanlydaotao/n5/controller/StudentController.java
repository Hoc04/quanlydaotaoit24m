package com.example.quanlydaotao.n5.controller;

import com.example.quanlydaotao.n5.entity.Student;
import com.example.quanlydaotao.n5.service.StudentService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@CrossOrigin("*")
public class StudentController {
    private final StudentService service;
    public StudentController(StudentService service) { this.service = service; }

    @GetMapping
    public List<Student> getAll() { return service.findAll(); }

    @PostMapping
    public Student create(@RequestBody Student s) { return service.save(s); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) { service.delete(id); }
}