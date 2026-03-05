import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'live_reservations_view.dart';
import 'menu_master_view.dart';
import 'live_website_view.dart';
import '../widgets/glass_bottom_nav.dart';
import '../constants/app_colors.dart';

class CommandCenterView extends StatefulWidget {
  const CommandCenterView({Key? key}) : super(key: key);

  @override
  State<CommandCenterView> createState() => _CommandCenterViewState();
}

class _CommandCenterViewState extends State<CommandCenterView> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const LiveReservationsView(),
    const MenuMasterView(),
    const LiveWebsiteView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.midnightBlack,
      body: PageTransitionSwitcher(
        duration: const Duration(milliseconds: 500),
        transitionBuilder: (child, animation, secondaryAnimation) {
          return SharedAxisTransition(
            animation: animation,
            secondaryAnimation: secondaryAnimation,
            transitionType: SharedAxisTransitionType.horizontal,
            fillColor: AppColors.midnightBlack,
            child: child,
          );
        },
        child: _pages[_currentIndex],
      ),
      bottomNavigationBar: GlassBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
