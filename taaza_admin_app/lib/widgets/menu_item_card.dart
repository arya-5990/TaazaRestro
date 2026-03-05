import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/menu_item_model.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';
import '../view_models/menu_master_view_model.dart';

class MenuItemCard extends StatelessWidget {
  final MenuItemModel item;
  final VoidCallback onEdit;

  const MenuItemCard({Key? key, required this.item, required this.onEdit})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<MenuMasterViewModel>(context, listen: false);

    return GestureDetector(
      onTap: onEdit,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.deepCharcoal,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.metallicGold.withOpacity(0.1)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              flex: 3,
              child: ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(16)),
                child: item.imageUrl.isNotEmpty
                    ? Image.network(item.imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                              color: AppColors.midnightBlack,
                              child: const Icon(Icons.fastfood,
                                  color: AppColors.metallicGold),
                            ))
                    : Container(
                        color: AppColors.midnightBlack,
                        child: const Icon(Icons.fastfood,
                            color: AppColors.metallicGold)),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: AppTypography.serifHeader(
                          fontSize: 16, color: AppColors.pureWhite),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '₹${item.price.toStringAsFixed(0)}',
                      style: AppTypography.sansData(
                          color: AppColors.metallicGold,
                          fontWeight: FontWeight.bold),
                    ),
                    const Spacer(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          item.isAvailable ? 'In Stock' : 'Out of Stock',
                          style: AppTypography.sansData(
                            fontSize: 10,
                            color: item.isAvailable
                                ? Colors.green
                                : AppColors.dangerRed,
                          ),
                        ),
                        Transform.scale(
                          scale: 0.8,
                          child: Switch(
                            value: item.isAvailable,
                            onChanged: (val) =>
                                viewModel.toggleAvailability(item, val),
                            activeColor: AppColors.metallicGold,
                            activeTrackColor:
                                AppColors.metallicGold.withOpacity(0.3),
                            inactiveThumbColor:
                                AppColors.offWhite.withOpacity(0.5),
                            inactiveTrackColor: AppColors.midnightBlack,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
