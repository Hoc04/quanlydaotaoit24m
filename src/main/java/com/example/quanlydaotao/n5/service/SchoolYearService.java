package com.example.quanlydaotao.n5.service;
import com.example.quanlydaotao.n5.entity.SchoolYear;
import com.example.quanlydaotao.n5.repository.SchoolYearRepository;
import org.springframework.stereotype.Service;
import java.util.List; import java.util.UUID;
@Service
public class SchoolYearService {
    private final SchoolYearRepository repo;
    public SchoolYearService(SchoolYearRepository repo) { this.repo = repo; }
    public List<SchoolYear> findAll() { return repo.findAll(); }
    public SchoolYear save(SchoolYear e) { return repo.save(e); }
    public SchoolYear findById(UUID id) { return repo.findById(id).orElseThrow(); }
    public void delete(UUID id) { repo.deleteById(id); }
}