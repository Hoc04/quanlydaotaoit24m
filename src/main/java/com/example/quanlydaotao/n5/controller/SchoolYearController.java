package com.example.quanlydaotao.n5.controller;
import com.example.quanlydaotao.n5.entity.SchoolYear;
import com.example.quanlydaotao.n5.service.SchoolYearService;
import org.springframework.web.bind.annotation.*;
import java.util.List; import java.util.UUID;
@RestController @RequestMapping("/api/school-years") @CrossOrigin("*")
public class SchoolYearController {
    private final SchoolYearService service;
    public SchoolYearController(SchoolYearService service) { this.service = service; }
    @GetMapping public List<SchoolYear> getAll() { return service.findAll(); }
    @PostMapping public SchoolYear create(@RequestBody SchoolYear e) { return service.save(e); }
    @PutMapping("/{id}") public SchoolYear update(@PathVariable UUID id, @RequestBody SchoolYear e) { e.setId(id); return service.save(e); }
    @DeleteMapping("/{id}") public void delete(@PathVariable UUID id) { service.delete(id); }
}