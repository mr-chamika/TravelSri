package com.example.student.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "guide_quotations")
public class TGuideQuotation {

    @Id
    private String quotationId;

    @Field("pending_trip_id")
    private String pendingTripId;

    @Field("guide_id")
    private String guideId;

    @Field("quotation_pdf")
    private byte[] quotationPdf; // Store PDF as byte array

    @Field("price")
    private Double price;

    @Field("pdf_filename")
    private String pdfFilename; // Optional: store original filename

    @Field("pdf_content_type")
    private String pdfContentType;
}
