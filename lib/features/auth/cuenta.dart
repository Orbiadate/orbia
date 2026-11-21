import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';

/// Pantalla base de Cuenta / Perfil (Fase 2)
class CuentaView extends StatelessWidget {
  const CuentaView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cuenta'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTemas.espaciadoMd),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(AppTemas.espaciadoMd),
              child: Row(
                children: [
                  const CircleAvatar(
                    radius: 28,
                    backgroundColor: AppTemas.primario,
                    child: Icon(Icons.person, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: AppTemas.espaciadoMd),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Usuario ORBIA', style: tema.textTheme.titleMedium),
                      const SizedBox(height: 2),
                      Text('usuario@orbia.app', style: tema.textTheme.bodyMedium),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
          OutlinedButton.icon(
            onPressed: () => context.push('/auth'),
            icon: const Icon(Icons.login),
            label: const Text('Ir a Pantalla de Autenticación (Login)'),
          ),
        ],
      ),
    );
  }
}
