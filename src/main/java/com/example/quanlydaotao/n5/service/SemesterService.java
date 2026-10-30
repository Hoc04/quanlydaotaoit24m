package com.example.quanlydaotao.n5.service;
import com.example.quanlydaotao.n5.entity.Semester; import com.example.quanlydaotao.n5.entity.SchoolYear;
import com.example.quanlydaotao.n5.repository.SemesterRepository; import com.example.quanlydaotao.n5.repository.SchoolYearRepository;
import org.springframework.stereotype.Service;
import java.util.List; import java.util.UUID;
@Service
public class SemesterService {
    private final SemesterRepository repo; private final SchoolYearRepository syRepo;
    public SemesterService(SemesterRepository repo, SchoolYearRepository syRepo) { this.repo = repo; this.syRepo = syRepo; }
    public List<Semester> findAll() { return repo.findAll(); }
    public Semester save(Semester e, UUID syId) {
        if (syId != null) {
            SchoolYear sy = syRepo.findById(syId).orElseThrow();
            e.setSchoolYear(sy); e.setSchoolYearName(sy.getName());
        }
        return repo.save(e);
    }
    public Semester findById(UUID id) { return repo.findById(id).orElseThrow(); }
    public void delete(UUID id) { repo.deleteById(id); }
}