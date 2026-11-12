import 'package:flutter/material.dart';
import '../../../core/temas.dart';

class PlanoWidget extends StatelessWidget {
  final String titulo;
  final VoidCallback onLocalSeleccionado;

  const PlanoWidget({
    super.key,
    required this.titulo,
    required this.onLocalSeleccionado,
  });

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTemas.espaciadoMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(titulo, style: tema.textTheme.titleSmall),
            const SizedBox(height: AppTemas.espaciadoSm),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: 8,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                mainAxisSpacing: 6,
                crossAxisSpacing: 6,
                childAspectRatio: 1.8,
              ),
              itemBuilder: (context, index) {
                final esActivo = index == 3; // Local 12 destacado
                return InkWell(
                  onTap: esActivo ? onLocalSeleccionado : null,
                  borderRadius: BorderRadius.circular(AppTemas.radioSm),
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: esActivo ? AppTemas.gradientePrimario : null,
                      color: esActivo ? null : AppTemas.fondoSecundario,
                      borderRadius: BorderRadius.circular(AppTemas.radioSm),
                      border: Border.all(
                        color: esActivo ? AppTemas.primario : AppTemas.borde,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      '${index + 9}',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: esActivo ? FontWeight.w800 : FontWeight.w600,
                        color: esActivo ? Colors.white : AppTemas.textoSecundario,
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

