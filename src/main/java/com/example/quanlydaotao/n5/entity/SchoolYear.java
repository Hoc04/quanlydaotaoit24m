package com.example.quanlydaotao.n5.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "school_years")
public class SchoolYear extends BaseEntity {
    private String code;
    private String name;
    private String description;
    private String note;
    private LocalDate startDate;
    private LocalDate endDate;

    // Getters & Setters
    public String getCode() { return code; } public void setCode(String code) { this.code = code; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getNote() { return note; } public void setNote(String note) { this.note = note; }
    public LocalDate getStartDate() { return startDate; } public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; } public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}