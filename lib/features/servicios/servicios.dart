import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';

/// Pantalla base del dominio Servicios (Fase 2)
class ServiciosView extends StatelessWidget {
  const ServiciosView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Servicios'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTemas.espaciadoMd),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppTemas.espaciadoMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Catálogo de Servicios', style: tema.textTheme.titleMedium),
                  const SizedBox(height: AppTemas.espaciadoSm),
                  Text(
                    'Explora los servicios disponibles en Plaza Central y reserva tu cita.',
                    style: tema.textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
          ElevatedButton.icon(
            onPressed: () => context.push('/local'),
            icon: const Icon(Icons.storefront_outlined),
            label: const Text('Ver Detalle del Local'),
          ),
          const SizedBox(height: AppTemas.espaciadoSm),
          OutlinedButton.icon(
            onPressed: () => context.push('/lugar'),
            icon: const Icon(Icons.place_outlined),
            label: const Text('Ver Plaza Central (Lugar)'),
          ),
        ],
      ),
    );
  }
}
