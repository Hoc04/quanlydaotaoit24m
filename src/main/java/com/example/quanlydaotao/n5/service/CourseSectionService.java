package com.example.quanlydaotao.n5.service;
import com.example.quanlydaotao.n5.entity.CourseSection; import com.example.quanlydaotao.n5.entity.Semester;
import com.example.quanlydaotao.n5.repository.CourseSectionRepository; import com.example.quanlydaotao.n5.repository.SemesterRepository;
import org.springframework.stereotype.Service;
import java.util.List; import java.util.UUID;
@Service
public class CourseSectionService {
    private final CourseSectionRepository repo; private final SemesterRepository semRepo;
    public CourseSectionService(CourseSectionRepository repo, SemesterRepository semRepo) { this.repo = repo; this.semRepo = semRepo; }
    public List<CourseSection> findAll() { return repo.findAll(); }
    public CourseSection save(CourseSection e, UUID semId) {
        if (semId != null) { e.setSemester(semRepo.findById(semId).orElseThrow()); }
        return repo.save(e);
    }
    public void delete(UUID id) { repo.deleteById(id); }
}