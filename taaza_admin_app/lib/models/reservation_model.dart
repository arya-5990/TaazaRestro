class ReservationModel {
  final String id;
  final String customerName;
  final String phoneNumber;
  final int partySize;
  final DateTime reservationTime;
  String status; // 'pending', 'confirmed', 'rejected'
  String? rejectionReason;

  ReservationModel({
    required this.id,
    required this.customerName,
    required this.phoneNumber,
    required this.partySize,
    required this.reservationTime,
    required this.status,
    this.rejectionReason,
  });
}
