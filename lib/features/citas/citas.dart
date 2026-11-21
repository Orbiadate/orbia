import 'package:flutter/material.dart';
import '../../core/temas.dart';

/// Pantalla base del dominio Citas (Fase 2)
class CitasView extends StatelessWidget {
  const CitasView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Citas'),
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
                  Text('Gestión de Citas', style: tema.textTheme.titleMedium),
                  const SizedBox(height: AppTemas.espaciadoSm),
                  Text(
                    'Aquí podrás consultar tus citas agendadas, modificarlas o cancelarlas.',
                    style: tema.textTheme.bodyMedium,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
          Card(
            child: ListTile(
              leading: const Icon(Icons.event_available, color: AppTemas.primario),
              title: const Text('Cita #1 — Barbería'),
              subtitle: Text('15 de Noviembre a las 10:00 hrs', style: tema.textTheme.bodyMedium),
              trailing: const Chip(
                label: Text('Confirmada', style: TextStyle(fontSize: 11)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
