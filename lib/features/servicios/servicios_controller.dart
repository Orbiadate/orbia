import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';

class ServiciosController extends ChangeNotifier {
  bool _cargando = true;
  List<Map<String, dynamic>> _servicios = [];

  bool get cargando => _cargando;
  List<Map<String, dynamic>> get servicios => _servicios;

  Future<void> cargarServicios() async {
    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.get('/servicios');
    if (res['ok'] == true && res['servicios'] is List) {
      _servicios = List<Map<String, dynamic>>.from(res['servicios']);
    } else {
      // Fallback local determinista
      _servicios = [
        {'id': 'corte-1', 'nombre': 'Corte Clásico', 'precio': 180, 'duracionMinutos': 30},
        {'id': 'barba-1', 'nombre': 'Arreglo de Barba', 'precio': 120, 'duracionMinutos': 20},
        {'id': 'combo-1', 'nombre': 'Corte y Barba', 'precio': 260, 'duracionMinutos': 45},
        {'id': 'facial-1', 'nombre': 'Limpieza Facial', 'precio': 200, 'duracionMinutos': 30},
      ];
    }
    _cargando = false;
    notifyListeners();
  }
}

