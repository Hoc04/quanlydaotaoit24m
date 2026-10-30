package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "student_code")
    private String studentCode;
    
    @Column(name = "full_name")
    private String fullName;
    
    private String email;
    private String phone;
    
    @Column(name = "class_name")
    private String className;

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getStudentCode() { return studentCode; } 
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }
    
    public String getFullName() { return fullName; } 
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getEmail() { return email; } 
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; } 
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getClassName() { return className; } 
    public void setClassName(String className) { this.className = className; }
}