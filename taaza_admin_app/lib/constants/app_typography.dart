import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  static TextStyle serifHeader({double fontSize = 24, FontWeight fontWeight = FontWeight.w600, Color color = AppColors.metallicGold}) {
    return GoogleFonts.playfairDisplay(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }

  static TextStyle sansData({double fontSize = 14, FontWeight fontWeight = FontWeight.w400, Color color = AppColors.offWhite}) {
    return GoogleFonts.montserrat(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
    );
  }
}
