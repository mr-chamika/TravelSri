package com.example.student.services;

import com.example.student.model.Booking;

public interface INotificationService {
    void notifyTravelerBookingConfirmed(Booking booking);
    void notifyTravelerBookingRejected(Booking booking);
    void notifyProviderBookingCancelled(Booking booking);
    void notifyProviderNewBooking(Booking booking);
}
