import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';

class CitasController extends ChangeNotifier {
  bool _cargando = false;
  List<Map<String, dynamic>> _citas = [];
  Map<String, dynamic>? _horarioSugerido;
  String? _mensajeAsistente;

  bool get cargando => _cargando;
  List<Map<String, dynamic>> get citas => _citas;
  Map<String, dynamic>? get horarioSugerido => _horarioSugerido;
  String? get mensajeAsistente => _mensajeAsistente;

  Future<void> cargarCitas() async {
    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.get('/citas');
    if (res['ok'] == true && res['citas'] is List) {
      _citas = List<Map<String, dynamic>>.from(res['citas']);
    } else {
      _citas = [
        {
          'id': 'cita-1',
          'usuario': 'carlos',
          'fecha': '2026-11-15',
          'hora': '10:00',
          'estado': 'confirmada',
        }
      ];
    }
    _cargando = false;
    notifyListeners();
  }

  /// Consulta la disponibilidad exclusivamente a través de la API del backend (Requisito 4)
  Future<void> consultarDisponibilidadBackend({
    String? servicio,
    String? franjaHora,
    String? franjaFecha,
  }) async {
    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.consultarDisponibilidad(
      negocioId: 'negocio-1',
      servicio: servicio,
      franjaHora: franjaHora,
      franjaFecha: franjaFecha,
    );

    _cargando = false;
    if (res['ok'] == true) {
      _horarioSugerido = res['mejor'] as Map<String, dynamic>?;
      _mensajeAsistente = 'Disponibilidad verificada en backend con éxito.';
    } else {
      _mensajeAsistente = 'No se encontró disponibilidad para la opción solicitada.';
    }
    notifyListeners();
  }

  /// Envía la solicitud al LLM / Parser a través del backend tool endpoint
  Future<void> procesarSolicitudIA(String mensaje) async {
    _cargando = true;
    _mensajeAsistente = null;
    notifyListeners();

    final res = await ApiCliente.parsearMensajeIA(mensaje);
    if (res['ok'] == true && res['data']?['solicitud'] != null) {
      final sol = res['data']['solicitud'] as Map<String, dynamic>;
      final servicio = sol['servicio']?.toString();
      final franjaHora = sol['franjaHora']?.toString();
      final franjaFecha = sol['franjaFecha']?.toString();

      await consultarDisponibilidadBackend(
        servicio: servicio,
        franjaHora: franjaHora,
        franjaFecha: franjaFecha,
      );
    } else {
      _cargando = false;
      _mensajeAsistente = 'No pudimos procesar tu mensaje. Intenta de nuevo.';
      notifyListeners();
    }
  }

  Future<bool> confirmarCita(String usuario) async {
    if (_horarioSugerido == null) return false;

    _cargando = true;
    notifyListeners();

    final res = await ApiCliente.post('/citas', {
      'usuario': usuario,
      'horario': _horarioSugerido,
    });

    _cargando = false;
    if (res['ok'] == true) {
      _horarioSugerido = null;
      _mensajeAsistente = '¡Cita confirmada exitosamente!';
      await cargarCitas();
      return true;
    }
    return false;
  }

  Future<void> cancelarCita(String citaId) async {
    await ApiCliente.post('/citas/$citaId/cancelar', {});
    await cargarCitas();
  }
}

