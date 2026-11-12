import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'local_controller.dart';
import 'widgets/local_header_widget.dart';

/// Pantalla del Local (Requisito 6)
class LocalView extends StatefulWidget {
  const LocalView({super.key});

  @override
  State<LocalView> createState() => _LocalViewState();
}

class _LocalViewState extends State<LocalView> {
  final _controller = LocalController();

  @override
  void initState() {
    super.initState();
    _controller.cargarLocal();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle del Local'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          if (_controller.cargando) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTemas.espaciadoMd),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                LocalHeaderWidget(local: _controller.local),
                const SizedBox(height: AppTemas.espaciadoLg),

                // Tarjeta de Información
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTemas.espaciadoMd),
                    child: Column(
                      children: [
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.schedule, color: AppTemas.primario),
                          title: const Text('Horario de Atención'),
                          subtitle: Text(
                            _controller.local['horario']?.toString() ?? '9:00 AM - 8:00 PM',
                            style: tema.textTheme.bodyMedium,
                          ),
                        ),
                        const Divider(color: AppTemas.borde),
                        ListTile(
                          contentPadding: EdgeInsets.zero,
                          leading: const Icon(Icons.phone, color: AppTemas.acento),
                          title: const Text('Contacto Directo'),
                          subtitle: Text(
                            _controller.local['telefono']?.toString() ?? '+52 55 1234 5678',
                            style: tema.textTheme.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: AppTemas.espaciadoLg),

                // Botones de acción
                ElevatedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, AppRutas.citas),
                  icon: const Icon(Icons.auto_awesome),
                  label: const Text('Agendar Cita con Asistente IA'),
                ),
                const SizedBox(height: AppTemas.espaciadoSm),
                OutlinedButton.icon(
                  onPressed: () => Navigator.pushNamed(context, AppRutas.servicios),
                  icon: const Icon(Icons.list_alt),
                  label: const Text('Ver Catálogo Completo de Servicios'),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

