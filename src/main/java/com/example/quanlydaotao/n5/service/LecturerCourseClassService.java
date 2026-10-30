package com.example.quanlydaotao.n5.service;
import com.example.quanlydaotao.n5.entity.LecturerCourseClass; import com.example.quanlydaotao.n5.entity.CourseSection;
import com.example.quanlydaotao.n5.repository.LecturerCourseClassRepository; import com.example.quanlydaotao.n5.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;
import java.util.List; import java.util.UUID;
@Service
public class LecturerCourseClassService {
    private final LecturerCourseClassRepository repo; private final CourseSectionRepository csRepo;
    public LecturerCourseClassService(LecturerCourseClassRepository repo, CourseSectionRepository csRepo) { this.repo = repo; this.csRepo = csRepo; }
    public List<LecturerCourseClass> findAll() { return repo.findAll(); }
    public LecturerCourseClass save(LecturerCourseClass e, UUID csId) {
        if (csId != null) { e.setCourseSection(csRepo.findById(csId).orElseThrow()); }
        return repo.save(e);
    }
    public void delete(UUID id) { repo.deleteById(id); }
}