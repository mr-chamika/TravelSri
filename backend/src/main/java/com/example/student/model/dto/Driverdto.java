package com.example.student.model.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@Document(collection = "vehicles")
public class Driverdto {

    @Id
    private String _id;
    private String image;
    private String verified;
    private String name;
    private String identified;

    Driverdto( String _id,String image,String verified,String name,String identified) {

        this._id=_id;
this.image=image;
this.verified=verified;
this.name=name;
this.identified=identified;

    }

}
