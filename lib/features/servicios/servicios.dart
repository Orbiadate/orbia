import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'servicios_controller.dart';
import 'widgets/servicio_card_widget.dart';

/// Pantalla de Servicios del local (Requisito 6)
class ServiciosView extends StatefulWidget {
  const ServiciosView({super.key});

  @override
  State<ServiciosView> createState() => _ServiciosViewState();
}

class _ServiciosViewState extends State<ServiciosView> {
  final _controller = ServiciosController();

  @override
  void initState() {
    super.initState();
    _controller.cargarServicios();
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
        title: const Text('Servicios'),
        actions: [
          IconButton(
            icon: const Icon(Icons.place_outlined),
            tooltip: 'Ver Lugares',
            onPressed: () => Navigator.pushNamed(context, AppRutas.lugar),
          ),
          IconButton(
            icon: const Icon(Icons.storefront_outlined),
            tooltip: 'Ver Local',
            onPressed: () => Navigator.pushNamed(context, AppRutas.local),
          ),
        ],
      ),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          if (_controller.cargando) {
            return const Center(child: CircularProgressIndicator());
          }

          return ListView(
            padding: const EdgeInsets.all(AppTemas.espaciadoMd),
            children: [
              // Banner de selección de lugar
              Card(
                child: ListTile(
                  leading: const CircleAvatar(
                    backgroundColor: AppTemas.primario,
                    child: Icon(Icons.location_on, color: Colors.white),
                  ),
                  title: const Text('Plaza Central'),
                  subtitle: const Text('Local 12 · Barbería Clásica'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Navigator.pushNamed(context, AppRutas.lugar),
                ),
              ),
              const SizedBox(height: AppTemas.espaciadoMd),

              Text('Catálogo de Servicios', style: tema.textTheme.titleMedium),
              const SizedBox(height: AppTemas.espaciadoSm),

              ..._controller.servicios.map((s) => Padding(
                    padding: const EdgeInsets.only(bottom: AppTemas.espaciadoSm),
                    child: ServicioCardWidget(
                      servicio: s,
                      onTap: () => Navigator.pushNamed(context, AppRutas.citas),
                    ),
                  )),
            ],
          );
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1,
        onTap: (index) {
          if (index == 0) Navigator.pushReplacementNamed(context, AppRutas.lugar);
          if (index == 2) Navigator.pushNamed(context, AppRutas.citas);
          if (index == 3) Navigator.pushNamed(context, AppRutas.cuenta);
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), label: 'Explorar'),
          BottomNavigationBarItem(icon: Icon(Icons.spa_outlined), label: 'Servicios'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_month_outlined), label: 'Citas'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Cuenta'),
        ],
      ),
    );
  }
}

