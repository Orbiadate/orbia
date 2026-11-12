import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';

class LugarController extends ChangeNotifier {
  bool _cargando = true;
  Map<String, dynamic> _lugar = {};
  List<Map<String, dynamic>> _locales = [];

  bool get cargando => _cargando;
  Map<String, dynamic> get lugar => _lugar;
  List<Map<String, dynamic>> get locales => _locales;

  Future<void> cargarLugar([String id = 'lugar-plaza-central']) async {
    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.get('/lugares/$id');
    if (res['ok'] == true && res['lugar'] is Map) {
      _lugar = Map<String, dynamic>.from(res['lugar']);
      if (res['locales'] is List) {
        _locales = List<Map<String, dynamic>>.from(res['locales']);
      }
    } else {
      _lugar = {
        'id': 'lugar-plaza-central',
        'nombre': 'Plaza Central',
        'subtitulo': 'Centro comercial y servicios',
      };
      _locales = [
        {'id': 'local-12', 'nombre': 'Barbería Clásica', 'tipo': 'Barbería', 'numeroLocal': '12'},
        {'id': 'local-14', 'nombre': 'Salón Belleza Total', 'tipo': 'Estética', 'numeroLocal': '14'},
        {'id': 'local-03', 'nombre': 'Café Gourmet', 'tipo': 'Comida', 'numeroLocal': '03'},
      ];
    }
    _cargando = false;
    notifyListeners();
  }
}

