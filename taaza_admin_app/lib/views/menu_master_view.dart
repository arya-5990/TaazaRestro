import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../view_models/menu_master_view_model.dart';
import '../models/menu_item_model.dart';
import '../widgets/custom_sliver_app_bar.dart';
import '../widgets/menu_item_card.dart';
import '../constants/app_colors.dart';
import '../constants/app_typography.dart';

class MenuMasterView extends StatelessWidget {
  const MenuMasterView({Key? key}) : super(key: key);

  void _showEditSheet(BuildContext context, MenuItemModel? item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.deepCharcoal,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom,
            top: 24,
            left: 24,
            right: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(item == null ? 'Add Item' : 'Edit Item',
                  style: AppTypography.serifHeader()),
              const SizedBox(height: 16),
              TextField(
                controller: TextEditingController(text: item?.title ?? ''),
                decoration: InputDecoration(
                  labelText: 'Title',
                  labelStyle:
                      TextStyle(color: AppColors.offWhite.withOpacity(0.5)),
                  enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(
                          color: AppColors.metallicGold.withOpacity(0.5))),
                  focusedBorder: const UnderlineInputBorder(
                      borderSide: BorderSide(color: AppColors.metallicGold)),
                ),
                style: AppTypography.sansData(),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.metallicGold,
                    foregroundColor: AppColors.midnightBlack),
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Save'),
              ),
              const SizedBox(height: 24),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final viewModel = Provider.of<MenuMasterViewModel>(context);
    final items = viewModel.menuItems;

    return Scaffold(
      backgroundColor: AppColors.midnightBlack,
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.metallicGold,
        onPressed: () => _showEditSheet(context, null),
        child: const Icon(Icons.add, color: AppColors.midnightBlack),
      ),
      body: CustomScrollView(
        slivers: [
          const CustomSliverAppBar(title: 'Menu Master'),
          items.isEmpty
              ? SliverFillRemaining(
                  child: Center(
                    child: Text('No menu items present.',
                        style: TextStyle(
                            color: AppColors.offWhite.withOpacity(0.5))),
                  ),
                )
              : SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverGrid(
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 0.7,
                    ),
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        return MenuItemCard(
                          item: items[index],
                          onEdit: () => _showEditSheet(context, items[index]),
                        );
                      },
                      childCount: items.length,
                    ),
                  ),
                ),
        ],
      ),
    );
  }
}
