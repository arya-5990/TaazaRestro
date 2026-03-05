import 'package:flutter/material.dart';
import '../models/reservation_model.dart';

class ReservationsViewModel extends ChangeNotifier {
  final List<ReservationModel> _reservations = [
    ReservationModel(
      id: '1',
      customerName: 'Arjun Mehta',
      phoneNumber: '+91 98765 43210',
      partySize: 4,
      reservationTime: DateTime.now().add(const Duration(hours: 1)),
      status: 'pending',
    ),
    ReservationModel(
      id: '2',
      customerName: 'Priya Sharma',
      phoneNumber: '+91 91234 56789',
      partySize: 2,
      reservationTime:
          DateTime.now().add(const Duration(hours: 2, minutes: 30)),
      status: 'pending',
    ),
    ReservationModel(
      id: '3',
      customerName: 'Rohan Verma',
      phoneNumber: '+91 99887 76655',
      partySize: 6,
      reservationTime: DateTime.now().add(const Duration(hours: 3)),
      status: 'confirmed',
    ),
    ReservationModel(
      id: '4',
      customerName: 'Sneha Iyer',
      phoneNumber: '+91 94455 66778',
      partySize: 3,
      reservationTime: DateTime.now().subtract(const Duration(hours: 1)),
      status: 'rejected',
      rejectionReason: 'Fully booked for that slot',
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
