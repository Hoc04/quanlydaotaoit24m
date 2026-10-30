package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "academic_years")
public class AcademicYear extends BaseEntity {
    private String code;
    private String name;
    private String year;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    // Getters & Setters
    public String getCode() { return code; } public void setCode(String code) { this.code = code; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getYear() { return year; } public void setYear(String year) { this.year = year; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}