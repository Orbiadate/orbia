import 'package:flutter/foundation.dart';
import '../../core/api_cliente.dart';

class AuthController extends ChangeNotifier {
  bool _cargando = false;
  String? _error;
  Map<String, dynamic>? _usuarioActual;

  bool get cargando => _cargando;
  String? get error => _error;
  bool get estaAutenticado => _usuarioActual != null;
  Map<String, dynamic>? get usuarioActual => _usuarioActual;

  Future<bool> iniciarSesion(String correo, String password) async {
    _cargando = true;
    _error = null;
    notifyListeners();

    final res = await ApiCliente.post('/auth/login', {
      'correo': correo,
      'password': password,
    });

    _cargando = false;
    if (res['ok'] == true) {
      _usuarioActual = res['usuario'] as Map<String, dynamic>?;
      notifyListeners();
      return true;
    } else {
      _error = res['error']?.toString() ?? 'Error al iniciar sesión';
      notifyListeners();
      return false;
    }
  }

  Future<bool> registrar(String nombre, String correo, String password) async {
    _cargando = true;
    _error = null;
    notifyListeners();

    final res = await ApiCliente.post('/auth/registro', {
      'nombre': nombre,
      'correo': correo,
      'password': password,
    });

    _cargando = false;
    if (res['ok'] == true) {
      _usuarioActual = res['usuario'] as Map<String, dynamic>?;
      notifyListeners();
      return true;
    } else {
      _error = res['error']?.toString() ?? 'Error al registrar cuenta';
      notifyListeners();
      return false;
    }
  }

  void modoInvitado() {
    _usuarioActual = {'nombre': 'Invitado', 'correo': 'invitado@orbia.app'};
    _error = null;
    notifyListeners();
  }

  void cerrarSesion() {
    _usuarioActual = null;
    ApiCliente.post('/auth/logout', {});
    notifyListeners();
  }
}
