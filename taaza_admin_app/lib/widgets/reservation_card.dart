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

  Color get _statusColor {
    switch (reservation.status) {
      case 'confirmed':
        return const Color(0xFF4CAF50);
      case 'rejected':
        return AppColors.dangerRed;
      default:
        return AppColors.softGold;
    }
  }

  String get _statusLabel {
    switch (reservation.status) {
      case 'confirmed':
        return '✓  CONFIRMED';
      case 'rejected':
        return '✕  REJECTED';
      default:
        return '●  PENDING';
    }
  }

  String _formatDateTime(DateTime dt) {
    final date =
        '${dt.day.toString().padLeft(2, '0')}-${dt.month.toString().padLeft(2, '0')}-${dt.year}';
    final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final minute = dt.minute.toString().padLeft(2, '0');
    final period = dt.hour < 12 ? 'AM' : 'PM';
    return '$date  •  $hour:$minute $period';
  }

  void _callCustomer() async {
    final Uri launchUri = Uri(scheme: 'tel', path: reservation.phoneNumber);
    if (await canLaunchUrl(launchUri)) await launchUrl(launchUri);
  }

  void _showRejectDialog(BuildContext context) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppColors.deepCharcoal,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text('Reject Reservation',
            style: AppTypography.serifHeader(
                color: AppColors.dangerRed, fontSize: 20)),
        content: TextField(
          controller: controller,
          style: AppTypography.sansData(color: AppColors.pureWhite),
          maxLines: 3,
          decoration: InputDecoration(
            hintText: 'Reason for rejection...',
            hintStyle: TextStyle(
                color: AppColors.offWhite.withOpacity(0.4), fontSize: 13),
            filled: true,
            fillColor: AppColors.midnightBlack,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide.none,
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel',
                style: AppTypography.sansData(color: AppColors.offWhite)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.dangerRed,
                foregroundColor: AppColors.pureWhite,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8))),
            onPressed: () {
              onReject(controller.text);
              Navigator.pop(context);
              Navigator.pop(context); // close detail sheet too
            },
            child: const Text('Confirm Reject'),
          ),
        ],
      ),
    );
  }

  void _showDetailSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _DetailSheet(
        reservation: reservation,
        onAccept: () {
          onAccept();
          Navigator.pop(context);
        },
        onReject: () => _showRejectDialog(context),
        onCall: _callCustomer,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isPending = reservation.status == 'pending';

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          boxShadow: isPending
              ? [
                  BoxShadow(
                      color: AppColors.metallicGold.withOpacity(0.18),
                      blurRadius: 14,
                      spreadRadius: 1)
                ]
              : [],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(14),
          child: Slidable(
            key: ValueKey(reservation.id),
            startActionPane: isPending
                ? ActionPane(
                    motion: const BehindMotion(),
                    children: [
                      SlidableAction(
                        onPressed: (_) {
                          onAccept();
                        },
                        backgroundColor: const Color(0xFF4CAF50),
                        foregroundColor: AppColors.pureWhite,
                        icon: Icons.check_circle_outline,
                        label: 'Accept',
                        borderRadius: const BorderRadius.horizontal(
                            left: Radius.circular(14)),
                      ),
                    ],
                  )
                : null,
            endActionPane: isPending
                ? ActionPane(
                    motion: const BehindMotion(),
                    children: [
                      SlidableAction(
                        onPressed: (_) => _showRejectDialog(context),
                        backgroundColor: AppColors.dangerRed,
                        foregroundColor: AppColors.pureWhite,
                        icon: Icons.cancel_outlined,
                        label: 'Reject',
                        borderRadius: const BorderRadius.horizontal(
                            right: Radius.circular(14)),
                      ),
                    ],
                  )
                : null,
            child: Material(
              color: AppColors.deepCharcoal,
              child: InkWell(
                onTap: () => _showDetailSheet(context),
                splashColor: AppColors.metallicGold.withOpacity(0.08),
                highlightColor: AppColors.metallicGold.withOpacity(0.04),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      // Status indicator bar
                      Container(
                        width: 4,
                        height: 52,
                        margin: const EdgeInsets.only(right: 14),
                        decoration: BoxDecoration(
                          color: _statusColor,
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              reservation.customerName,
                              style: AppTypography.serifHeader(
                                  fontSize: 17, color: AppColors.pureWhite),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${reservation.partySize} guests  •  ${_formatDateTime(reservation.reservationTime)}',
                              style: AppTypography.sansData(
                                  fontSize: 12,
                                  color: AppColors.offWhite.withOpacity(0.6)),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: _statusColor.withOpacity(0.12),
                                    borderRadius: BorderRadius.circular(6),
                                    border: Border.all(
                                        color: _statusColor.withOpacity(0.35)),
                                  ),
                                  child: Text(
                                    _statusLabel,
                                    style: AppTypography.sansData(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: _statusColor),
                                  ),
                                ),
                                if (reservation.occasion != null) ...[
                                  const SizedBox(width: 8),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: AppColors.metallicGold
                                          .withOpacity(0.08),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      reservation.occasion!,
                                      style: AppTypography.sansData(
                                          fontSize: 10,
                                          color: AppColors.metallicGold
                                              .withOpacity(0.8)),
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ],
                        ),
                      ),
                      // View details chevron
                      Column(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.phone_outlined, size: 20),
                            color: AppColors.metallicGold,
                            onPressed: _callCustomer,
                            tooltip: 'Call',
                          ),
                          Icon(Icons.chevron_right,
                              color: AppColors.offWhite.withOpacity(0.3),
                              size: 18),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Detail Bottom Sheet ───────────────────────────────────────────────────

class _DetailSheet extends StatelessWidget {
  final ReservationModel reservation;
  final VoidCallback onAccept;
  final VoidCallback onReject;
  final VoidCallback onCall;

  const _DetailSheet({
    required this.reservation,
    required this.onAccept,
    required this.onReject,
    required this.onCall,
  });

  String _formatDate(DateTime dt) =>
      '${dt.day.toString().padLeft(2, '0')}-${dt.month.toString().padLeft(2, '0')}-${dt.year}';

  String _formatTime(DateTime dt) {
    final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final minute = dt.minute.toString().padLeft(2, '0');
    final period = dt.hour < 12 ? 'AM' : 'PM';
    return '$hour:$minute $period';
  }

  @override
  Widget build(BuildContext context) {
    final isPending = reservation.status == 'pending';

    return DraggableScrollableSheet(
      initialChildSize: 0.88,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (_, controller) => Container(
        decoration: const BoxDecoration(
          color: AppColors.deepCharcoal,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            // Drag handle
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 4),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.offWhite.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    child: Text('Reservation Details',
                        style: AppTypography.serifHeader(fontSize: 22)),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(Icons.close,
                        color: AppColors.offWhite.withOpacity(0.5)),
                  ),
                ],
              ),
            ),
            const Divider(color: Color(0xFF2A2926), height: 1),
            // Content
            Expanded(
              child: ListView(
                controller: controller,
                padding: const EdgeInsets.all(24),
                children: [
                  _DetailRow(
                    icon: Icons.person_outline,
                    label: 'Full Name',
                    value: reservation.customerName,
                  ),
                  _DetailRow(
                    icon: Icons.email_outlined,
                    label: 'Email Address',
                    value: reservation.email,
                  ),
                  _DetailRow(
                    icon: Icons.phone_outlined,
                    label: 'Phone Number',
                    value: reservation.phoneNumber,
                    trailing: IconButton(
                      onPressed: onCall,
                      icon: const Icon(Icons.call, size: 18),
                      color: AppColors.metallicGold,
                      style: IconButton.styleFrom(
                        backgroundColor:
                            AppColors.metallicGold.withOpacity(0.12),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8)),
                      ),
                    ),
                  ),
                  _DetailRow(
                    icon: Icons.calendar_today_outlined,
                    label: 'Preferred Date',
                    value: _formatDate(reservation.reservationTime),
                  ),
                  _DetailRow(
                    icon: Icons.access_time_outlined,
                    label: 'Preferred Time',
                    value: _formatTime(reservation.reservationTime),
                  ),
                  _DetailRow(
                    icon: Icons.people_outline,
                    label: 'Guests',
                    value:
                        '${reservation.partySize} Guest${reservation.partySize > 1 ? 's' : ''}',
                  ),
                  _DetailRow(
                    icon: Icons.celebration_outlined,
                    label: 'Occasion',
                    value: reservation.occasion ?? '— Not specified —',
                    muted: reservation.occasion == null,
                  ),
                  _DetailRow(
                    icon: Icons.sticky_note_2_outlined,
                    label: 'Special Requests',
                    value: reservation.specialRequests?.isNotEmpty == true
                        ? reservation.specialRequests!
                        : '— None —',
                    muted: reservation.specialRequests == null ||
                        reservation.specialRequests!.isEmpty,
                    multiLine: true,
                  ),
                  if (reservation.status == 'rejected' &&
                      reservation.rejectionReason != null) ...[
                    const SizedBox(height: 4),
                    _DetailRow(
                      icon: Icons.info_outline,
                      label: 'Rejection Reason',
                      value: reservation.rejectionReason!,
                      valueColor: AppColors.dangerRed,
                    ),
                  ],
                  const SizedBox(height: 24),
                  // Status badge
                  Center(
                    child: _StatusBadgeLarge(status: reservation.status),
                  ),
                  const SizedBox(height: 32),
                  // Action buttons for pending
                  if (isPending) ...[
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: onReject,
                            icon: const Icon(Icons.cancel_outlined, size: 18),
                            label: const Text('Reject'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppColors.dangerRed,
                              side: BorderSide(
                                  color: AppColors.dangerRed.withOpacity(0.6)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton.icon(
                            onPressed: onAccept,
                            icon: const Icon(Icons.check_circle_outline,
                                size: 18),
                            label: const Text('Accept Reservation'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.metallicGold,
                              foregroundColor: AppColors.midnightBlack,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                              textStyle: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Detail Row ────────────────────────────────────────────────────────────

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final bool muted;
  final bool multiLine;
  final Color? valueColor;
  final Widget? trailing;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.muted = false,
    this.multiLine = false,
    this.valueColor,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment:
            multiLine ? CrossAxisAlignment.start : CrossAxisAlignment.center,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.metallicGold.withOpacity(0.08),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon,
                size: 18, color: AppColors.metallicGold.withOpacity(0.7)),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: AppTypography.sansData(
                      fontSize: 11,
                      color: AppColors.offWhite.withOpacity(0.45)),
                ),
                const SizedBox(height: 3),
                Text(
                  value,
                  style: AppTypography.sansData(
                    fontSize: 14,
                    color: muted
                        ? AppColors.offWhite.withOpacity(0.35)
                        : (valueColor ?? AppColors.pureWhite),
                  ),
                ),
              ],
            ),
          ),
          if (trailing != null) trailing!,
        ],
      ),
    );
  }
}

// ─── Status Badge ──────────────────────────────────────────────────────────

class _StatusBadgeLarge extends StatelessWidget {
  final String status;

  const _StatusBadgeLarge({required this.status});

  @override
  Widget build(BuildContext context) {
    final Color color;
    final String label;
    final IconData icon;

    switch (status) {
      case 'confirmed':
        color = const Color(0xFF4CAF50);
        label = 'Confirmed';
        icon = Icons.check_circle;
        break;
      case 'rejected':
        color = AppColors.dangerRed;
        label = 'Rejected';
        icon = Icons.cancel;
        break;
      default:
        color = AppColors.softGold;
        label = 'Awaiting Decision';
        icon = Icons.hourglass_top_rounded;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(30),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 8),
          Text(label,
              style: AppTypography.sansData(
                  fontSize: 13, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}
