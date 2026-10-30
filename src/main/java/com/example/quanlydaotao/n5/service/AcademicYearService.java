package com.example.quanlydaotao.n5.service;
import com.example.quanlydaotao.n5.entity.AcademicYear;
import com.example.quanlydaotao.n5.repository.AcademicYearRepository;
import org.springframework.stereotype.Service;
import java.util.List; import java.util.UUID;
@Service
public class AcademicYearService {
    private final AcademicYearRepository repo;
    public AcademicYearService(AcademicYearRepository repo) { this.repo = repo; }
    public List<AcademicYear> findAll() { return repo.findAll(); }
    public AcademicYear save(AcademicYear e) { return repo.save(e); }
    public AcademicYear findById(UUID id) { return repo.findById(id).orElseThrow(); }
    public void delete(UUID id) { repo.deleteById(id); }
}