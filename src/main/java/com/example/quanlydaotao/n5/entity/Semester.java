package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "semesters")
public class Semester extends BaseEntity {
    private String code;
    private String name;
    private String schoolYearName;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "school_year_id")
    private SchoolYear schoolYear;

    // Getters & Setters
    public String getCode() { return code; } public void setCode(String code) { this.code = code; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getSchoolYearName() { return schoolYearName; } public void setSchoolYearName(String schoolYearName) { this.schoolYearName = schoolYearName; }
    public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public SchoolYear getSchoolYear() { return schoolYear; } public void setSchoolYear(SchoolYear schoolYear) { this.schoolYear = schoolYear; }
}