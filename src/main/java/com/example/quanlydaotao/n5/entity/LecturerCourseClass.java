package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "lecturer_course_classes")
public class LecturerCourseClass extends BaseEntity {
    
    @Column(name = "lecturer_id") // <-- Thêm dòng này để map với cột trong SQL
    private UUID employeeId;
    
    private String role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_class_id") 
    private CourseSection courseSection;

    // Getters & Setters
    public UUID getEmployeeId() { return employeeId; } 
    public void setEmployeeId(UUID employeeId) { this.employeeId = employeeId; }
    
    public String getRole() { return role; } 
    public void setRole(String role) { this.role = role; }
    
    public CourseSection getCourseSection() { return courseSection; } 
    public void setCourseSection(CourseSection courseSection) { this.courseSection = courseSection; }
}