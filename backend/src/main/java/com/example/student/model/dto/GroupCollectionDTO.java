package com.example.student.model.dto;

import com.example.student.model.UpcomingTrip;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupCollectionDTO {

    private String id; // upcomingTripId

    private String image; // image URL or base64

    private String title; // route title like "Matara to Colombo"

    private Integer duration; // numberOfDates

    private String date; // formatted date string

    private String stats; // tripStatus (Confirm, Pending, Cancelled)

    private Double price; // totalPricePerPerson

    private Integer max; // numberOfSeats

    private Integer current; // current participants count

    // Static factory method to create from UpcomingTrip
    public static GroupCollectionDTO fromUpcomingTrip(UpcomingTrip upcomingTrip, Integer currentParticipants, String imageUrl) {
        return GroupCollectionDTO.builder()
                .id(upcomingTrip.getUpcomingTripId())
                .image(imageUrl)
                .title(upcomingTrip.getStartLocation() + " to " + upcomingTrip.getEndLocation())
                .duration(upcomingTrip.getNumberOfDates())
                .date(formatDate(upcomingTrip.getDate()))
                .stats(mapTripStatus(upcomingTrip.getTripStatus()))
                .price(upcomingTrip.getTotalPricePerPerson())
                .max(upcomingTrip.getNumberOfSeats())
                .current(currentParticipants)
                .build();
    }

    private static String formatDate(LocalDate date) {
        if (date != null) {
            String[] months = {"", "january", "february", "march", "april", "may", "june",
                    "july", "august", "september", "october", "november", "december"};
            return String.format("%02d %s %d",
                    date.getDayOfMonth(),
                    months[date.getMonthValue()],
                    date.getYear());
        }
        return "";
    }

    private static String mapTripStatus(String tripStatus) {
        if (tripStatus == null) return "Pending";

        switch (tripStatus.toLowerCase()) {
            case "confirmed":
                return "Confirm";
            case "cancelled":
                return "Cancelled";
            default:
                return "Pending";
        }
    }
}