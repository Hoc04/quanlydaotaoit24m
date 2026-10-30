package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "student_course_sections")
public class StudentCourseSection extends BaseEntity {
    private UUID studentId;
    private LocalDateTime registrationDate;
    private String registrationType;
    private String status;
    private String attemptNumber;
    private String note;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_section_id")
    private CourseSection courseSection;

    // Getters & Setters
    public UUID getStudentId() { return studentId; } public void setStudentId(UUID studentId) { this.studentId = studentId; }
    public LocalDateTime getRegistrationDate() { return registrationDate; } public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    public String getRegistrationType() { return registrationType; } public void setRegistrationType(String registrationType) { this.registrationType = registrationType; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getAttemptNumber() { return attemptNumber; } public void setAttemptNumber(String attemptNumber) { this.attemptNumber = attemptNumber; }
    public String getNote() { return note; } public void setNote(String note) { this.note = note; }
    public CourseSection getCourseSection() { return courseSection; } public void setCourseSection(CourseSection courseSection) { this.courseSection = courseSection; }
}