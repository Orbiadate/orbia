import 'package:flutter/material.dart';
import 'core/temas.dart';
import 'core/rutas.dart';

/// Punto de Entrada Principal de ORBIA (Requisito 7).
/// Únicamente configura la app, el tema centralizado y las rutas por dominios.
/// Cero lógica de presentación de pantallas en este archivo.
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OrbiaApp());
}

class OrbiaApp extends StatelessWidget {
  const OrbiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ORBIA',
      debugShowCheckedModeBanner: false,
      theme: AppTemas.temaOscuro,
      initialRoute: AppRutas.login,
      routes: AppRutas.rutas,
    );
  }
}
