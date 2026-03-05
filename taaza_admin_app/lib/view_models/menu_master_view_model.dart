import 'package:flutter/material.dart';
import '../models/menu_item_model.dart';

class MenuMasterViewModel extends ChangeNotifier {
  final List<MenuItemModel> _items = [
    MenuItemModel(
      id: '1',
      title: 'Butter Chicken',
      description: 'Tender chicken in a rich, creamy tomato-based sauce',
      price: 320,
      category: 'Main Course',
      imageUrl:
          'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
      isAvailable: true,
    ),
    MenuItemModel(
      id: '2',
      title: 'Paneer Tikka',
      description: 'Marinated cottage cheese grilled in a tandoor',
      price: 260,
      category: 'Starters',
      imageUrl:
          'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400',
      isAvailable: true,
    ),
    MenuItemModel(
      id: '3',
      title: 'Dal Makhani',
      description: 'Slow-cooked black lentils in a buttery tomato gravy',
      price: 200,
      category: 'Main Course',
      imageUrl:
          'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
      isAvailable: true,
    ),
    MenuItemModel(
      id: '4',
      title: 'Garlic Naan',
      description: 'Leavened flatbread topped with garlic and butter',
      price: 60,
      category: 'Breads',
      imageUrl:
          'https://images.unsplash.com/photo-1598515213692-3e9a99c9d5c6?w=400',
      isAvailable: false,
    ),
    MenuItemModel(
      id: '5',
      title: 'Mango Lassi',
      description: 'Sweet yogurt drink blended with fresh Alphonso mangoes',
      price: 120,
      category: 'Beverages',
      imageUrl:
          'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400',
      isAvailable: true,
    ),
    MenuItemModel(
      id: '6',
      title: 'Gulab Jamun',
      description:
          'Soft milk-solid dumplings soaked in rose-flavoured sugar syrup',
      price: 100,
      category: 'Desserts',
      imageUrl:
          'https://images.unsplash.com/photo-1666539669613-b26dde2a7dab?w=400',
      isAvailable: true,
    ),
  ];

  List<MenuItemModel> get menuItems => List.unmodifiable(_items);

  void toggleAvailability(MenuItemModel item, bool isAvailable) {
    final idx = _items.indexWhere((i) => i.id == item.id);
    if (idx != -1) {
      _items[idx].isAvailable = isAvailable;
      notifyListeners();
    }
  }

  void saveMenuItem(MenuItemModel item) {
    final idx = _items.indexWhere((i) => i.id == item.id);
    if (idx == -1) {
      _items.add(item);
    } else {
      _items[idx] = item;
    }
    notifyListeners();
  }
}
