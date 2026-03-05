import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class CustomSliverAppBar extends StatelessWidget {
  final String title;

  const CustomSliverAppBar({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      backgroundColor: AppColors.midnightBlack,
      pinned: true,
      expandedHeight: 120.0,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
        title: Text(
          title,
          style: AppTypography.serifHeader(fontSize: 22, color: AppColors.metallicGold),
        ),
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [AppColors.midnightBlack, AppColors.deepCharcoal],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -40,
                top: -20,
                child: Opacity(
                  opacity: 0.1,
                  child: Icon(
                    Icons.restaurant_menu,
                    size: 150,
                    color: AppColors.metallicGold,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
