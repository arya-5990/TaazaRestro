class MenuItemModel {
  final String id;
  final String title;
  final String description;
  final double price;
  final String category;
  final String imageUrl;
  bool isAvailable;

  MenuItemModel({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.category,
    required this.imageUrl,
    required this.isAvailable,
  });
}
