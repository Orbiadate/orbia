import 'package:flutter/material.dart';
import '../../../core/temas.dart';

class CitaCardWidget extends StatelessWidget {
  final Map<String, dynamic> cita;
  final VoidCallback onCancelar;

  const CitaCardWidget({
    super.key,
    required this.cita,
    required this.onCancelar,
  });

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final id = cita['id']?.toString() ?? '';
    final fecha = cita['fecha']?.toString() ?? '';
    final hora = cita['hora']?.toString() ?? '';
    final estado = cita['estado']?.toString() ?? 'confirmada';
    final esCancelada = estado == 'cancelada';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTemas.espaciadoMd),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: esCancelada
                    ? AppTemas.error.withValues(alpha: 0.15)
                    : AppTemas.exito.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(AppTemas.radioMd),
              ),
              child: Icon(
                esCancelada ? Icons.close : Icons.event_available,
                color: esCancelada ? AppTemas.error : AppTemas.exito,
              ),
            ),
            const SizedBox(width: AppTemas.espaciadoMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Cita #$id', style: tema.textTheme.titleMedium),
                  const SizedBox(height: 2),
                  Text('$fecha a las $hora hrs', style: tema.textTheme.bodyMedium),
                  Text(
                    'Estado: $estado',
                    style: tema.textTheme.bodySmall?.copyWith(
                      color: esCancelada ? AppTemas.error : AppTemas.exito,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
            if (!esCancelada)
              TextButton(
                onPressed: onCancelar,
                style: TextButton.styleFrom(foregroundColor: AppTemas.error),
                child: const Text('Cancelar'),
              ),
          ],
        ),
      ),
    );
  }
}

