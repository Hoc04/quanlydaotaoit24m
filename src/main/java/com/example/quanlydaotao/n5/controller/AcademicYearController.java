package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.AcademicYear;
import com.example.quanlydaotao.n5.service.AcademicYearService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/academic-years") @CrossOrigin("*")
public class AcademicYearController {
    private final AcademicYearService service;
    public AcademicYearController(AcademicYearService service) { this.service = service; }
    @GetMapping public List<AcademicYear> getAll() { return service.findAll(); }
    @PostMapping public AcademicYear create(@RequestBody AcademicYear e) { return service.save(e); }
    @PutMapping("/{id}") public AcademicYear update(@PathVariable UUID id, @RequestBody AcademicYear e) { e.setId(id); return service.save(e); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}