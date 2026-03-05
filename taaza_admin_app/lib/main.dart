import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'constants/app_colors.dart';
import 'view_models/reservations_view_model.dart';
import 'view_models/menu_master_view_model.dart';
import 'views/command_center_view.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  await Firebase.initializeApp(
    options: FirebaseOptions(
      apiKey: dotenv.env['FIREBASE_API_KEY']!,
      authDomain: dotenv.env['FIREBASE_AUTH_DOMAIN']!,
      projectId: dotenv.env['FIREBASE_PROJECT_ID']!,
      storageBucket: dotenv.env['FIREBASE_STORAGE_BUCKET']!,
      messagingSenderId: dotenv.env['FIREBASE_MESSAGING_SENDER_ID']!,
      appId: dotenv.env['FIREBASE_APP_ID']!,
      measurementId: dotenv.env['FIREBASE_MEASUREMENT_ID']!,
    ),
  );
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
