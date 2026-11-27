import 'dart:convert';
import 'package:http/http.dart' as http;

/// Cliente HTTP para comunicación JSON con el backend de ORBIA (Node.js/Express)
class ApiCliente {
  static const String baseUrl = 'http://localhost:3000/api';
  static String? token;

  static Map<String, String> _crearHeaders() {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> body) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _crearHeaders(),
        body: jsonEncode(body),
      );
      return jsonDecode(response.body) as Map<String, dynamic>;
    } catch (e) {
      return {'ok': false, 'error': 'Error de conexión: $e'};
    }
  }

  static Future<Map<String, dynamic>> get(String endpoint, [Map<String, String>? params]) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint').replace(queryParameters: params);
      final response = await http.get(uri, headers: _crearHeaders());
      return jsonDecode(response.body) as Map<String, dynamic>;
    } catch (e) {
      return {'ok': false, 'error': 'Error de conexión: $e'};
    }
  }

  // Endpoints específicos de Tools
  static Future<Map<String, dynamic>> consultarDisponibilidad({
    String? negocioId,
    String? servicio,
    String? franjaHora,
    String? franjaFecha,
  }) async {
    final query = <String, String>{};
    if (negocioId != null) query['negocioId'] = negocioId;
    if (servicio != null) query['servicio'] = servicio;
    if (franjaHora != null) query['franjaHora'] = franjaHora;
    if (franjaFecha != null) query['franjaFecha'] = franjaFecha;
    return get('/tools/disponibilidad', query);
  }

  static Future<Map<String, dynamic>> parsearMensajeIA(String mensaje, [String? usuario]) async {
    return post('/tools/parse', {
      'mensaje': mensaje,
      'nombreUsuario': usuario ?? 'cliente',
    });
  }
}

