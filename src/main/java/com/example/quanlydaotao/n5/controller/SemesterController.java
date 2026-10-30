package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.Semester;
import com.example.quanlydaotao.n5.service.SemesterService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/semesters") @CrossOrigin("*")
public class SemesterController {
    private final SemesterService service;
    public SemesterController(SemesterService service) { this.service = service; }
    @GetMapping public List<Semester> getAll() { return service.findAll(); }
    @PostMapping public Semester create(@RequestBody Semester e, @RequestParam(required = false) UUID schoolYearId) { return service.save(e, schoolYearId); }
    @PutMapping("/{id}") public Semester update(@PathVariable UUID id, @RequestBody Semester e, @RequestParam(required = false) UUID schoolYearId) { e.setId(id); return service.save(e, schoolYearId); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}