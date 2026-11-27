import '../../core/api_cliente.dart';

/// Servicio de Autenticación que gestiona la comunicación HTTP con el backend de ORBIA.
/// Desacoplado de la interfaz gráfica y de los widgets.
class AuthService {
  const AuthService();

  Future<Map<String, dynamic>> login({
    required String correo,
    required String contrasena,
  }) async {
    return ApiCliente.post('/auth/login', {
      'correo': correo.trim(),
      'contrasena': contrasena,
    });
  }

  Future<Map<String, dynamic>> registro({
    required String nombre,
    required String correo,
    required String contrasena,
    required String confirmacion,
  }) async {
    return ApiCliente.post('/auth/registro', {
      'nombre': nombre.trim(),
      'correo': correo.trim(),
      'contrasena': contrasena,
      'confirmacion': confirmacion,
    });
  }

  Future<Map<String, dynamic>> consultarUsuarioActual() async {
    return ApiCliente.get('/auth/yo');
  }
}

