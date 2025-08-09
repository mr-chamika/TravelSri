package com.example.student.services;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class Hashingpw {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // Apply the global CORS configuration
                .csrf(csrf -> csrf.disable()) // Disable CSRF, common for stateless APIs
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/user/signup",
                                "/user/login",
                                "/user/check-email",
                                "/user/profile",
                                "/user/reset-password",
                                "/guide/groupTours",
                                "/guide/submitQuotation/**", // Fixed: Allow all submitQuotation endpoints
                                "/guide/submittedQuotation/{guideId}", // Fixed: Allow all submittedQuotation endpoints
                                "/vehicle/addVehicle",
                                "/vehicle/all",
                                "/vehicle/edit",
                                "/traveler/**",
                                "/api/pendingTrip/getall",
                                "/api/pendingTrip/create",
                                "/api/pendingTrip/update/{id}",
                                "/api/pendingTrip/delete/{id}",
                                "/api/pendingTrip/get/{id}",
                                "/api/guide/create",
                                "/api/guide/getall",
                                "/api/guide/get/{id}",
                                "/api/guide/delete/{id}",
                                "/api/guide/city/{baseCity}",
                                "/api/guide/language/{language}",
                                "/api/guide/experience/{minExperience}",
                                "/api/guide/rate/range",
                                "/api/guide/area/{area}",
                                "/api/vehicle/create",
                                "/api/vehicle/getall",
                                "/api/vehicle/get/{id}",
                                "/api/vehicle/delete/{id}",
                                "/api/vehicle/type/{vehicleType}",
                                "/api/vehicle/city/{baseCity}",
                                "/api/vehicle/capacity/{seatingCapacity}",
                                "/api/vehicle/capacity/min/{minCapacity}",
                                "/api/vehicle/capacity/max/{maxCapacity}",
                                "/api/vehicle/capacity/range",
                                "/city/{baseCity}/capacity/min/{minCapacity}",
                                "/city/update/{id}",
                                "/api/guide-quotation/create",
                                "/api/guide-quotation/create-json",
                                "/api/guide-quotation/get/{quotationId}",
                                "/api/guide-quotation/trip/{pendingTripId}",
                                "/api/guide-quotation/guide/{guideId}",
                                "/api/guide-quotation/trip/{pendingTripId}/guide/{guideId}",
                                "/api/guide-quotation/download-pdf/{quotationId}",
                                "/api/hotel-quotation/create",
                                "/api/hotel-quotation/create-json",
                                "/api/hotel-quotation/getall",
                                "/api/hotel-quotation/get/{quotationId}",
                                "/api/hotel-quotation/trip/{pendingTripId}",
                                "/api/hotel-quotation/hotel/{hotelId}",
                                "/api/hotel-quotation/trip/{pendingTripId}/hotel/{hotelId}",
                                "/api/hotel-quotation/download-pdf/{quotationId}",
                                "/api/quotation/create",
                                "/api/quotation/create-json",
                                "/api/quotation/getall",
                                "/api/quotation/get/{quotationId}",
                                "/api/quotation/trip/{pendingTripId}",
                                "/api/quotation/vehicle/{vehicleId}",
                                "/api/quotation/trip/{pendingTripId}/vehicle/{vehicleId}",
                                "/api/quotation/download-pdf/{quotationId}",
                                "/api/vehicle/create",
                                "/api/vehicle/getall",
                                "/api/vehicle/get/{id}",
                                "/api/vehicle/delete/{id}",
                                "/api/vehicle/type/{vehicleType}",
                                "/api/vehicle/city/{baseCity}",
                                "/api/vehicle/capacity/{seatingCapacity}",
                                "/api/vehicle/capacity/min/{minCapacity}",
                                "/api/vehicle/capacity/max/{maxCapacity}",
                                "/api/vehicle/capacity/range",
                                "/api/vehicle/city/{baseCity}/capacity/min/{minCapacity}",
                                "/api/vehicle/update/{id}",
                                "/api/quotations/{id}",
                                "/api/quotations/{id}/status",
                                "/api/admin-hotel-bookings/{id}",
                                "/api/admin-hotel-bookings/{id}",
                                "/auth/**",
                                "/shopitems/all",
                                "/shopitems/view",
                                "/shopitems/search",
                                "/shopitems/add",
                                "/shopitems/update",
                                "/shopitems/delete",
                                "/api/bookings/create",
                                "/api/bookings/get/{Id}",
                                "/api/bookings/traveler/{travelerId}",
                                "/api/bookings/provider/{providerId}",
                                "/api/payments/payhere/create-checkout",
                                "api/payments/payhere/notify",
                                "/api/payments/payhere/status/{orderId}",
                                "/api/bookings/{bookingId}/accept",
                                "api/bookings/{bookingId}/reject",
                                "/api/bookings/{bookingId}/cancel",
                                "/api/bookings/{bookingId}/complete",
                                "/api/payhere/test/generate-hash",
                                "/api/payhere/test/verify-hash",
                                "/shopitems/delete",
                                "/shopitems/by-shop",
                                "/api/payments/payhere/health",
                                "/api/wallet/platform",
                                "/api/bookings/create",
                                "/api/payments/payhere/create-checkout",
                                "/api/payments/payhere/notify",
                                "/api/wallet/platform",
                                "/api/wallet/traveler/{travelerId}",
                                "/api/payments/payhere/status/{orderId}",
                                "/api/bookings/{bookingId}/accept",
                                "api/payments/payhere/process-confirmation-fee/{bookingId}",
                                "/api/wallet/provider/{providerId}",
                                "/api/wallet/platform",
                                "/api/bookings/{bookingId}/cancel",
                                "/api/wallet/traveler/{travelerId}",
                                "/api/wallet/platform",
                                "/api/wallet/money-flow/summary",
                                "/api/wallet/money-flow/booking/{bookingId}",
                                "/api/payments/payhere/summary/{bookingId}",
                                "/api/guide/search"

                        ).permitAll() // <-- THIS LINE MAKES REGISTRATION PUBLIC
                        .anyRequest().authenticated() // Secure all other endpoints
                )
                .httpBasic(withDefaults()); // Use Basic Auth for the secured endpoints

        return http.build();
    }
}
