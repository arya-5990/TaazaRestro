import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../view_models/reservations_view_model.dart';
import '../widgets/reservation_card.dart';
import '../widgets/custom_sliver_app_bar.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class LiveReservationsView extends StatelessWidget {
  const LiveReservationsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<ReservationsViewModel>(context);

    return Scaffold(
      backgroundColor: AppColors.midnightBlack,
      body: CustomScrollView(
        slivers: [
          const CustomSliverAppBar(title: 'Live Reservations'),

          // ── Loading state ──────────────────────────────────────────────
          if (viewModel.isLoading)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      width: 36,
                      height: 36,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        color: AppColors.metallicGold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Fetching reservations…',
                      style: AppTypography.sansData(
                          color: AppColors.offWhite.withOpacity(0.5),
                          fontSize: 14),
                    ),
                  ],
                ),
              ),
            )

          // ── Error state ────────────────────────────────────────────────
          else if (viewModel.error != null)
            SliverFillRemaining(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.wifi_off_rounded,
                          color: AppColors.dangerRed.withOpacity(0.7),
                          size: 48),
                      const SizedBox(height: 16),
                      Text(
                        'Unable to load reservations',
                        style: AppTypography.serifHeader(
                            fontSize: 18, color: AppColors.dangerRed),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        viewModel.error!,
                        style: AppTypography.sansData(
                            fontSize: 12,
                            color: AppColors.offWhite.withOpacity(0.4)),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            )

          // ── Empty state ────────────────────────────────────────────────
          else if (viewModel.reservations.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.event_seat_outlined,
                        color: AppColors.offWhite.withOpacity(0.2), size: 54),
                    const SizedBox(height: 16),
                    Text(
                      'No reservations yet.',
                      style: AppTypography.sansData(
                          color: AppColors.offWhite.withOpacity(0.45),
                          fontSize: 15),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'New bookings from the website will appear here in real-time.',
                      style: AppTypography.sansData(
                          color: AppColors.offWhite.withOpacity(0.25),
                          fontSize: 12),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            )

          // ── Data ───────────────────────────────────────────────────────
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final reservation = viewModel.reservations[index];
                  return ReservationCard(
                    reservation: reservation,
                    onAccept: () => viewModel.acceptReservation(reservation.id),
                    onReject: (reason) =>
                        viewModel.rejectReservation(reservation.id, reason),
                  );
                },
                childCount: viewModel.reservations.length,
              ),
            ),
        ],
      ),
    );
  }
}
