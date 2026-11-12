import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'lugar_controller.dart';
import 'widgets/plano_widget.dart';

/// Pantalla del Lugar (Requisito 6)
class LugarView extends StatefulWidget {
  const LugarView({super.key});

  @override
  State<LugarView> createState() => _LugarViewState();
}

class _LugarViewState extends State<LugarView> {
  final _controller = LugarController();

  @override
  void initState() {
    super.initState();
    _controller.cargarLugar();
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
        title: const Text('Plaza Central'),
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

          final lugar = _controller.lugar;
          final nombre = lugar['nombre']?.toString() ?? 'Plaza Central';
          final subtitulo = lugar['subtitulo']?.toString() ?? 'Directorio de locales';

          return ListView(
            padding: const EdgeInsets.all(AppTemas.espaciadoMd),
            children: [
              Text(nombre, style: tema.textTheme.titleLarge),
              const SizedBox(height: 2),
              Text(subtitulo, style: tema.textTheme.bodyMedium),
              const SizedBox(height: AppTemas.espaciadoMd),

              // Widget interactivo del Plano
              PlanoWidget(
                titulo: 'Distribución de Locales',
                onLocalSeleccionado: () => Navigator.pushNamed(context, AppRutas.local),
              ),
              const SizedBox(height: AppTemas.espaciadoLg),

              Text('Locales en este Lugar', style: tema.textTheme.titleMedium),
              const SizedBox(height: AppTemas.espaciadoSm),

              ..._controller.locales.map((loc) {
                final esBarberia = loc['id'] == 'local-12';
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppTemas.espaciadoSm),
                  child: Card(
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: esBarberia ? AppTemas.primario : AppTemas.fondoSecundario,
                        child: Icon(
                          esBarberia ? Icons.content_cut : Icons.store,
                          color: Colors.white,
                        ),
                      ),
                      title: Text(loc['nombre']?.toString() ?? '', style: tema.textTheme.titleMedium),
                      subtitle: Text('${loc['tipo']} · Local ${loc['numeroLocal']}', style: tema.textTheme.bodyMedium),
                      trailing: const Icon(Icons.chevron_right),
                      onTap: () => Navigator.pushNamed(context, AppRutas.local),
                    ),
                  ),
                );
              }),
            ],
          );
        },
      ),
    );
  }
}

