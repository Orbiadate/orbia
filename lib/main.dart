import 'package:flutter/material.dart';
import 'core/temas.dart';
import 'core/rutas.dart';

/// Punto de Entrada Principal de ORBIA (Fase 2: Tema y Navegación Base).
/// Únicamente arranca la aplicación, aplica el tema centralizado y registra el router.
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const OrbiaApp());
}

class OrbiaApp extends StatelessWidget {
  const OrbiaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'ORBIA',
      debugShowCheckedModeBanner: false,
      theme: AppTemas.temaOscuro,
      routerConfig: AppRutas.router,
    );
  }
}
