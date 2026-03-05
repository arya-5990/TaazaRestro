class ReservationModel {
  final String id;
  final String customerName;
  final String email;
  final String phoneNumber;
  final int partySize;
  final DateTime reservationTime;
  final String? occasion;
  final String? specialRequests;
  String status; // 'pending', 'confirmed', 'rejected'
  String? rejectionReason;

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
  });
}
