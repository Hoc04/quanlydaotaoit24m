package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.CourseSection;
import com.example.quanlydaotao.n5.service.CourseSectionService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/course-sections") @CrossOrigin("*")
public class CourseSectionController {
    private final CourseSectionService service;
    public CourseSectionController(CourseSectionService service) { this.service = service; }
    @GetMapping public List<CourseSection> getAll() { return service.findAll(); }
    @PostMapping public CourseSection create(@RequestBody CourseSection e, @RequestParam(required = false) UUID semesterId) { return service.save(e, semesterId); }
    @PutMapping("/{id}") public CourseSection update(@PathVariable UUID id, @RequestBody CourseSection e, @RequestParam(required = false) UUID semesterId) { e.setId(id); return service.save(e, semesterId); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}