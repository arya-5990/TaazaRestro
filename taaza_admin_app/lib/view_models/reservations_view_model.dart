import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/reservation_model.dart';

class ReservationsViewModel extends ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;

  List<ReservationModel> _reservations = [];
  bool _isLoading = true;
  String? _error;

  List<ReservationModel> get reservations => List.unmodifiable(_reservations);
  bool get isLoading => _isLoading;
  String? get error => _error;

  ReservationsViewModel() {
    _listenToReservations();
  }

  /// Real-time listener on the 'reservation' collection,
  /// ordered by createdAt descending so newest appear first.
  void _listenToReservations() {
    _db
        .collection('reservation')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .listen(
      (snapshot) {
        _reservations = snapshot.docs
            .map((doc) => ReservationModel.fromFirestore(doc))
            .toList();
        _isLoading = false;
        _error = null;
        notifyListeners();
      },
      onError: (e) {
        _error = e.toString();
        _isLoading = false;
        notifyListeners();
      },
    );
  }

  /// Accept a reservation → updates 'status' to 'confirmed' in Firestore
  Future<void> acceptReservation(String id) async {
    try {
      await _db.collection('reservation').doc(id).update({
        'status': 'confirmed',
      });
    } catch (e) {
      _error = 'Failed to accept: $e';
      notifyListeners();
    }
  }

  /// Reject a reservation → updates status + stores reason in Firestore
  Future<void> rejectReservation(String id, String reason) async {
    try {
      await _db.collection('reservation').doc(id).update({
        'status': 'rejected',
        'rejectionReason': reason,
      });
    } catch (e) {
      _error = 'Failed to reject: $e';
      notifyListeners();
    }
  }
}
