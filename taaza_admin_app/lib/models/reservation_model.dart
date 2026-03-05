import 'package:cloud_firestore/cloud_firestore.dart';

class ReservationModel {
  final String id;
  final String customerName;
  final String email;
  final String phoneNumber;
  final int partySize;
  final DateTime reservationTime; // combined date + time
  final String? occasion;
  final String? specialRequests;
  String status; // 'pending', 'confirmed', 'rejected'
  String? rejectionReason;
  final DateTime? createdAt;

  ReservationModel({
    required this.id,
    required this.customerName,
    required this.email,
    required this.phoneNumber,
    required this.partySize,
    required this.reservationTime,
    this.occasion,
    this.specialRequests,
    required this.status,
    this.rejectionReason,
    this.createdAt,
  });

  /// Maps Firestore document fields → model
  /// Firestore fields: name, email, phone, guests, date (YYYY-MM-DD),
  /// time (HH:MM), occasion, notes, status, createdAt
  factory ReservationModel.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;

    // Parse 'date' (e.g. "2026-03-05") + 'time' (e.g. "15:00") → DateTime
    DateTime reservationTime;
    try {
      final dateStr = (data['date'] as String?) ?? '2000-01-01';
      final timeStr = (data['time'] as String?) ?? '00:00';
      final parts = dateStr.split('-');
      final timeParts = timeStr.split(':');
      reservationTime = DateTime(
        int.parse(parts[0]),
        int.parse(parts[1]),
        int.parse(parts[2]),
        int.parse(timeParts[0]),
        int.parse(timeParts[1]),
      );
    } catch (_) {
      reservationTime = DateTime.now();
    }

    // createdAt is a Firestore Timestamp
    DateTime? createdAt;
    if (data['createdAt'] is Timestamp) {
      createdAt = (data['createdAt'] as Timestamp).toDate();
    }

    return ReservationModel(
      id: doc.id,
      customerName: (data['name'] as String?) ?? 'Unknown',
      email: (data['email'] as String?) ?? '',
      phoneNumber: (data['phone'] as String?) ?? '',
      partySize: (data['guests'] as num?)?.toInt() ?? 1,
      reservationTime: reservationTime,
      occasion: (data['occasion'] as String?)?.isNotEmpty == true
          ? data['occasion']
          : null,
      specialRequests:
          (data['notes'] as String?)?.isNotEmpty == true ? data['notes'] : null,
      status: (data['status'] as String?) ?? 'pending',
      rejectionReason: data['rejectionReason'] as String?,
      createdAt: createdAt,
    );
  }

  /// Converts model back to a Firestore-compatible map (for updates)
  Map<String, dynamic> toMap() {
    return {
      'name': customerName,
      'email': email,
      'phone': phoneNumber,
      'guests': partySize,
      'date':
          '${reservationTime.year}-${reservationTime.month.toString().padLeft(2, '0')}-${reservationTime.day.toString().padLeft(2, '0')}',
      'time':
          '${reservationTime.hour.toString().padLeft(2, '0')}:${reservationTime.minute.toString().padLeft(2, '0')}',
      'occasion': occasion ?? '',
      'notes': specialRequests ?? '',
      'status': status,
      if (rejectionReason != null) 'rejectionReason': rejectionReason,
    };
  }
}
