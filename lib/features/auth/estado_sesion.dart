import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';
import 'auth_service.dart';

/// Manejador de estado de sesión global para la aplicación ORBIA.
/// Notifica a la interfaz y a GoRouter ante cualquier cambio de autenticación.
class EstadoSesion extends ChangeNotifier {
  final AuthService _servicio;

  EstadoSesion({AuthService? servicio}) : _servicio = servicio ?? const AuthService();

  Map<String, dynamic>? _usuario;
  String? _token;
  bool _cargando = false;
  String? _error;

  Map<String, dynamic>? get usuario => _usuario;
  String? get token => _token;
  bool get cargando => _cargando;
  String? get error => _error;
  bool get estaAutenticado => _usuario != null;

  String get nombreUsuario => _usuario?['nombre'] as String? ?? 'Invitado';
  String get correoUsuario => _usuario?['correo'] as String? ?? '';

  void limpiarError() {
    _error = null;
    notifyListeners();
  }

  Future<bool> iniciarSesion(String correo, String contrasena) async {
    _cargando = true;
    _error = null;
    notifyListeners();

    try {
      final respuesta = await _servicio.login(
        correo: correo,
        contrasena: contrasena,
      );

      _cargando = false;
      if (respuesta['ok'] == true) {
        _token = respuesta['token'] as String?;
        ApiCliente.token = _token;
        _usuario = respuesta['usuario'] as Map<String, dynamic>?;
        notifyListeners();
        return true;
      } else {
        _error = respuesta['error']?.toString() ?? 'Error al iniciar sesión';
        notifyListeners();
        return false;
      }
    } catch (e) {
      _cargando = false;
      _error = 'Error de conexión con el servidor: $e';
      notifyListeners();
      return false;
    }
  }

  Future<bool> registrar({
    required String nombre,
    required String correo,
    required String contrasena,
    required String confirmacion,
  }) async {
    _cargando = true;
    _error = null;
    notifyListeners();

    try {
      final respuesta = await _servicio.registro(
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        confirmacion: confirmacion,
      );

      _cargando = false;
      if (respuesta['ok'] == true) {
        _token = respuesta['token'] as String?;
        ApiCliente.token = _token;
        _usuario = respuesta['usuario'] as Map<String, dynamic>?;
        notifyListeners();
        return true;
      } else {
        final err = respuesta['error']?.toString() ?? 'Error al registrar cuenta';
        final erroresCampos = respuesta['errores'] as Map<String, dynamic>?;
        if (erroresCampos != null && erroresCampos.isNotEmpty) {
          _error = erroresCampos.values.first.toString();
        } else {
          _error = err;
        }
        notifyListeners();
        return false;
      }
    } catch (e) {
      _cargando = false;
      _error = 'Error de conexión con el servidor: $e';
      notifyListeners();
      return false;
    }
  }

  void cerrarSesion() {
    _usuario = null;
    _token = null;
    ApiCliente.token = null;
    _error = null;
    notifyListeners();
  }
}

/// Instancia global de sesión para inyección en enrutador y vistas
final estadoSesion = EstadoSesion();

