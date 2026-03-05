import 'package:flutter/material.dart';
import '../widgets/custom_sliver_app_bar.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class LiveWebsiteView extends StatelessWidget {
  const LiveWebsiteView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.midnightBlack,
      body: CustomScrollView(
        slivers: [
          const CustomSliverAppBar(title: 'Live View Control'),
          SliverFillRemaining(
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text("Website Hero Section Override", style: AppTypography.serifHeader()),
                  const SizedBox(height: 20),
                  Container(
                    width: 300,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.deepCharcoal,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.metallicGold),
                    ),
                    child: Column(
                      children: [
                         Text("Feature Today's Special?", style: AppTypography.sansData(color: AppColors.pureWhite)),
                         const SizedBox(height: 16),
                         SwitchListTile(
                           title: Text("Show on website", style: AppTypography.sansData(color: AppColors.pureWhite)),
                           value: true,
                           onChanged: (val) {},
                           activeColor: AppColors.metallicGold,
                           activeTrackColor: AppColors.metallicGold.withOpacity(0.3),
                         ),
                      ],
                    ),
                  )
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}
