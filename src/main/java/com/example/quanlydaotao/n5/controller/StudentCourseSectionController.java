package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.StudentCourseSection;
import com.example.quanlydaotao.n5.service.StudentCourseSectionService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/student-course-sections") @CrossOrigin("*")
public class StudentCourseSectionController {
    private final StudentCourseSectionService service;
    public StudentCourseSectionController(StudentCourseSectionService service) { this.service = service; }
    @GetMapping public List<StudentCourseSection> getAll() { return service.findAll(); }
    @PostMapping public StudentCourseSection create(@RequestBody StudentCourseSection e, @RequestParam(required = false) UUID courseSectionId) { return service.save(e, courseSectionId); }
    @PutMapping("/{id}") public StudentCourseSection update(@PathVariable UUID id, @RequestBody StudentCourseSection e, @RequestParam(required = false) UUID courseSectionId) { e.setId(id); return service.save(e, courseSectionId); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}