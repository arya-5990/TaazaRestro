import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/reservation_model.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class ReservationCard extends StatelessWidget {
  final ReservationModel reservation;
  final VoidCallback onAccept;
  final Function(String) onReject;

  const ReservationCard({
    Key? key,
    required this.reservation,
    required this.onAccept,
    required this.onReject,
  }) : super(key: key);

  void _callCustomer() async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: reservation.phoneNumber,
    );
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    }
  }

  void _showRejectDialog(BuildContext context) {
    TextEditingController controller = TextEditingController();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppColors.deepCharcoal,
        title: Text('Reject Reservation', style: AppTypography.serifHeader(color: AppColors.metallicGold)),
        content: TextField(
          controller: controller,
          style: AppTypography.sansData(color: AppColors.pureWhite),
          decoration: InputDecoration(
            hintText: 'Reason...',
            hintStyle: TextStyle(color: AppColors.offWhite.withOpacity(0.5)),
            enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: AppColors.metallicGold.withOpacity(0.5))),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel', style: AppTypography.sansData(color: AppColors.offWhite)),
          ),
          TextButton(
            onPressed: () {
              onReject(controller.text);
              Navigator.pop(context);
            },
            child: Text('Reject', style: AppTypography.sansData(color: AppColors.dangerRed)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    bool isPending = reservation.status == 'pending';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          boxShadow: isPending
              ? [BoxShadow(color: AppColors.metallicGold.withOpacity(0.2), blurRadius: 10, spreadRadius: 1)]
              : null,
          borderRadius: BorderRadius.circular(12),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Slidable(
            key: ValueKey(reservation.id),
            startActionPane: ActionPane(
              motion: const ScrollMotion(),
              children: [
                SlidableAction(
                  onPressed: (_) => onAccept(),
                  backgroundColor: AppColors.metallicGold,
                  foregroundColor: AppColors.midnightBlack,
                  icon: Icons.check,
                  label: 'Accept',
                ),
              ],
            ),
            endActionPane: ActionPane(
              motion: const ScrollMotion(),
              children: [
                SlidableAction(
                  onPressed: (_) => _showRejectDialog(context),
                  backgroundColor: AppColors.dangerRed,
                  foregroundColor: AppColors.pureWhite,
                  icon: Icons.close,
                  label: 'Reject',
                ),
              ],
            ),
            child: Container(
              padding: const EdgeInsets.all(16),
              color: AppColors.deepCharcoal,
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          reservation.customerName,
                          style: AppTypography.serifHeader(fontSize: 18, color: AppColors.pureWhite),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Party of ${reservation.partySize} • ${reservation.reservationTime.toString()}',
                          style: AppTypography.sansData(color: AppColors.offWhite.withOpacity(0.7)),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          reservation.status.toUpperCase(),
                          style: AppTypography.sansData(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: reservation.status == 'confirmed'
                                ? AppColors.metallicGold
                                : reservation.status == 'rejected'
                                    ? AppColors.dangerRed
                                    : AppColors.softGold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.phone),
                    color: AppColors.metallicGold,
                    onPressed: _callCustomer,
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
