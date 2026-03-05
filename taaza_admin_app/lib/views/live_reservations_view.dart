import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../view_models/reservations_view_model.dart';
import '../widgets/reservation_card.dart';
import '../widgets/custom_sliver_app_bar.dart';
import '../constants/app_colors.dart';

class LiveReservationsView extends StatelessWidget {
  const LiveReservationsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<ReservationsViewModel>(context);
    final reservations = viewModel.reservations;

    return Scaffold(
      backgroundColor: AppColors.midnightBlack,
      body: CustomScrollView(
        slivers: [
          const CustomSliverAppBar(title: 'Live Reservations'),
          reservations.isEmpty
              ? SliverFillRemaining(
                  child: Center(
                    child: Text('No active reservations.',
                        style: TextStyle(
                            color: AppColors.offWhite.withOpacity(0.5))),
                  ),
                )
              : SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) {
                      return ReservationCard(
                        reservation: reservations[index],
                        onAccept: () =>
                            viewModel.acceptReservation(reservations[index].id),
                        onReject: (reason) => viewModel.rejectReservation(
                            reservations[index].id, reason),
                      );
                    },
                    childCount: reservations.length,
                  ),
                ),
        ],
      ),
    );
  }
}
