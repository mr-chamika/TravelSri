package com.example.student.services;

import com.example.student.model.Booking;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements INotificationService {

    @Override
    public void notifyTravelerBookingConfirmed(Booking booking) {
        // Implement push notification, email, SMS logic
        System.out.println("Notifying traveler " + booking.getTravelerId() + " that booking " + booking.getId() + " is confirmed");
    }

    @Override
    public void notifyTravelerBookingRejected(Booking booking) {
        System.out.println("Notifying traveler " + booking.getTravelerId() + " that booking " + booking.getId() + " is rejected");
    }

    @Override
    public void notifyProviderBookingCancelled(Booking booking) {
        System.out.println("Notifying provider " + booking.getProviderId() + " that booking " + booking.getId() + " is cancelled");
    }

    @Override
    public void notifyProviderNewBooking(Booking booking) {
        System.out.println("Notifying provider " + booking.getProviderId() + " about new booking " + booking.getId());
    }
}