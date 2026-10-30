package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.LecturerCourseClass;
import com.example.quanlydaotao.n5.service.LecturerCourseClassService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/lecturer-course-classes") @CrossOrigin("*")
public class LecturerCourseClassController {
    private final LecturerCourseClassService service;
    public LecturerCourseClassController(LecturerCourseClassService service) { this.service = service; }
    @GetMapping public List<LecturerCourseClass> getAll() { return service.findAll(); }
    @PostMapping public LecturerCourseClass create(@RequestBody LecturerCourseClass e, @RequestParam(required = false) UUID courseSectionId) { return service.save(e, courseSectionId); }
    @PutMapping("/{id}") public LecturerCourseClass update(@PathVariable UUID id, @RequestBody LecturerCourseClass e, @RequestParam(required = false) UUID courseSectionId) { e.setId(id); return service.save(e, courseSectionId); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}