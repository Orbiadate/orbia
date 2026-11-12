import 'package:flutter/material.dart';
import '../../../core/temas.dart';

class ServicioCardWidget extends StatelessWidget {
  final Map<String, dynamic> servicio;
  final VoidCallback onTap;

  const ServicioCardWidget({
    super.key,
    required this.servicio,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final nombre = servicio['nombre']?.toString() ?? 'Servicio';
    final precio = servicio['precio']?.toString() ?? '150';
    final duracion = servicio['duracionMinutos']?.toString() ?? '30';

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTemas.radioLg),
        child: Padding(
          padding: const EdgeInsets.all(AppTemas.espaciadoMd),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppTemas.primario.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(AppTemas.radioMd),
                ),
                child: const Icon(Icons.content_cut, color: AppTemas.primario),
              ),
              const SizedBox(width: AppTemas.espaciadoMd),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(nombre, style: tema.textTheme.titleMedium),
                    const SizedBox(height: 2),
                    Text('$duracion min · Profesional certificado', style: tema.textTheme.bodyMedium),
                  ],
                ),
              ),
              Text(
                '\$$precio',
                style: tema.textTheme.titleMedium?.copyWith(color: AppTemas.acento),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

