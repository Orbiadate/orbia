import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';

/// Pantalla base del dominio Local (Fase 2)
class LocalView extends StatelessWidget {
  const LocalView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalle del Local'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
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
                  Text('Barbería Clásica & Spa', style: tema.textTheme.titleLarge),
                  const SizedBox(height: 4),
                  Text('Plaza Central · Local 12', style: tema.textTheme.bodyMedium),
                  const SizedBox(height: AppTemas.espaciadoMd),
                  Text(
                    'Especialistas en cortes clásicos, degradados y perfilado de barba.',
                    style: tema.textTheme.bodyLarge,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
          ElevatedButton.icon(
            onPressed: () => context.go('/citas'),
            icon: const Icon(Icons.calendar_month),
            label: const Text('Agendar en este Local'),
          ),
        ],
      ),
    );
  }
}
