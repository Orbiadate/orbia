import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';

class LocalController extends ChangeNotifier {
  bool _cargando = true;
  Map<String, dynamic> _local = {};

  bool get cargando => _cargando;
  Map<String, dynamic> get local => _local;

  Future<void> cargarLocal([String id = 'negocio-1']) async {
    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.get('/locales/$id');
    if (res['ok'] == true && res['local'] is Map) {
      _local = Map<String, dynamic>.from(res['local']);
    } else {
      _local = {
        'id': 'negocio-1',
        'nombre': 'Barbería Clásica & Spa',
        'direccion': 'Plaza Central, Local 12',
        'horario': 'Lun - Sáb: 9:00 AM - 8:00 PM',
        'telefono': '+52 55 1234 5678',
        'calificacion': 4.9,
      };
    }
    _cargando = false;
    notifyListeners();
  }
}

