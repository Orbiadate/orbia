import 'package:flutter/material.dart';
import '../../../core/temas.dart';

class LocalHeaderWidget extends StatelessWidget {
  final Map<String, dynamic> local;

  const LocalHeaderWidget({super.key, required this.local});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final nombre = local['nombre']?.toString() ?? 'Barbería ORBIA';
    final direccion = local['direccion']?.toString() ?? 'Plaza Central, Local 12';
    final calif = local['calificacion']?.toString() ?? '4.9';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: 140,
          decoration: BoxDecoration(
            gradient: AppTemas.gradientePrimario,
            borderRadius: BorderRadius.circular(AppTemas.radioLg),
          ),
          child: const Center(
            child: Icon(Icons.store, size: 64, color: Colors.white),
          ),
        ),
        const SizedBox(height: AppTemas.espaciadoMd),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(nombre, style: tema.textTheme.titleLarge),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppTemas.advertencia.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppTemas.radioPill),
              ),
              child: Row(
                children: [
                  const Icon(Icons.star, color: AppTemas.advertencia, size: 16),
                  const SizedBox(width: 4),
                  Text(calif, style: const TextStyle(fontWeight: FontWeight.w700, color: AppTemas.advertencia)),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: AppTemas.espaciadoXs),
        Text(direccion, style: tema.textTheme.bodyMedium),
      ],
    );
  }
}

