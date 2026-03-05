import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/app_colors.dart';
import 'view_models/reservations_view_model.dart';
import 'view_models/menu_master_view_model.dart';
import 'views/command_center_view.dart';

void main() {
  runApp(const TaazaAdminApp());
}

class TaazaAdminApp extends StatelessWidget {
  const TaazaAdminApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ReservationsViewModel()),
        ChangeNotifierProvider(create: (_) => MenuMasterViewModel()),
      ],
      child: MaterialApp(
        title: 'Taaza Executive Admin',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          scaffoldBackgroundColor: AppColors.midnightBlack,
          primaryColor: AppColors.metallicGold,
          colorScheme: const ColorScheme.dark(
            primary: AppColors.metallicGold,
            secondary: AppColors.softGold,
            surface: AppColors.deepCharcoal,
          ),
          bottomSheetTheme: const BottomSheetThemeData(
            backgroundColor: AppColors.deepCharcoal,
          ),
          useMaterial3: true,
        ),
        home: const CommandCenterView(),
      ),
    );
  }
}
