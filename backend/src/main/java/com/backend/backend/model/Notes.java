package com.backend.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "Notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notes {

    @Id
    @JsonSerialize(using = ToStringSerializer.class)
    @JsonProperty("id")
    private ObjectId _id;
    private String username;
    private String title;
    private String content;
    // date the user wrote in diary (date-only)
    private LocalDate noteDate;

}
