import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';

/// Pantalla base del dominio Lugar (Fase 2)
class LugarView extends StatelessWidget {
  const LugarView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Plaza Central (Lugar)'),
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
                  Text('Plano y Directorio', style: tema.textTheme.titleMedium),
                  const SizedBox(height: 4),
                  Text('Explora los establecimientos en Plaza Central.', style: tema.textTheme.bodyMedium),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
          Card(
            child: ListTile(
              leading: const Icon(Icons.store, color: AppTemas.primario),
              title: const Text('Local 12 — Barbería Clásica'),
              subtitle: Text('Barbería y Estética', style: tema.textTheme.bodyMedium),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.push('/local'),
            ),
          ),
        ],
      ),
    );
  }
}
