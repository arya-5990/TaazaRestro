import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

class GoldCheckPainter extends CustomPainter {
  final double progress;

  GoldCheckPainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.metallicGold
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final path = Path();
    if (progress > 0.0) {
      path.moveTo(size.width * 0.2, size.height * 0.5);
      path.lineTo(size.width * 0.45, size.height * 0.75);
    }
    if (progress > 0.5) {
      path.lineTo(size.width * 0.8, size.height * 0.25);
    }

    final pathMetrics = path.computeMetrics().toList();
    if (pathMetrics.isNotEmpty) {
      final metric = pathMetrics.first;
      final currentLength = metric.length * progress;
      final extracted = metric.extractPath(0, currentLength);
      canvas.drawPath(extracted, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
