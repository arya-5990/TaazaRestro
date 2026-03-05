import 'package:flutter/material.dart';
import '../models/reservation_model.dart';

class ReservationsViewModel extends ChangeNotifier {
  final List<ReservationModel> _reservations = [
    ReservationModel(
      id: '1',
      customerName: 'Ibrahim Al-Rashid',
      email: 'ibrahim@example.com',
      phoneNumber: '+91 98765 43210',
      partySize: 4,
      reservationTime: DateTime(2026, 3, 10, 19, 30),
      occasion: 'Birthday',
      specialRequests: 'Window seat preferred, one guest is vegetarian.',
      status: 'pending',
    ),
    ReservationModel(
      id: '2',
      customerName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phoneNumber: '+91 91234 56789',
      partySize: 2,
      reservationTime: DateTime(2026, 3, 11, 20, 0),
      occasion: 'Anniversary',
      specialRequests: 'Candlelight dinner setup if possible.',
      status: 'pending',
    ),
    ReservationModel(
      id: '3',
      customerName: 'Rohan Verma',
      email: 'rohan.v@example.com',
      phoneNumber: '+91 99887 76655',
      partySize: 6,
      reservationTime: DateTime(2026, 3, 9, 13, 0),
      occasion: null,
      specialRequests: 'Please arrange a high chair for a toddler.',
      status: 'confirmed',
    ),
    ReservationModel(
      id: '4',
      customerName: 'Sneha Iyer',
      email: 'sneha.iyer@example.com',
      phoneNumber: '+91 94455 66778',
      partySize: 3,
      reservationTime: DateTime(2026, 3, 8, 18, 30),
      occasion: null,
      specialRequests: null,
      status: 'rejected',
      rejectionReason: 'Fully booked for that slot',
    ),
    ReservationModel(
      id: '5',
      customerName: 'Karan Malhotra',
      email: 'karan.m@example.com',
      phoneNumber: '+91 97712 33445',
      partySize: 5,
      reservationTime: DateTime(2026, 3, 12, 21, 0),
      occasion: 'Business Dinner',
      specialRequests: 'Private booth needed. No pork dishes.',
      status: 'pending',
    ),
  ];

  List<ReservationModel> get reservations => List.unmodifiable(_reservations);

  void acceptReservation(String id) {
    final idx = _reservations.indexWhere((r) => r.id == id);
    if (idx != -1) {
      _reservations[idx].status = 'confirmed';
      notifyListeners();
    }
  }

  void rejectReservation(String id, String reason) {
    final idx = _reservations.indexWhere((r) => r.id == id);
    if (idx != -1) {
      _reservations[idx].status = 'rejected';
      _reservations[idx].rejectionReason = reason;
      notifyListeners();
    }
  }
}
