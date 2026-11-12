import 'package:flutter/material.dart';
import '../../core/temas.dart';
import 'citas_controller.dart';
import 'widgets/cita_card_widget.dart';

/// Pantalla de Gestión de Citas y Agendamiento (Dominio Citas)
class CitasView extends StatefulWidget {
  const CitasView({super.key});

  @override
  State<CitasView> createState() => _CitasViewState();
}

class _CitasViewState extends State<CitasView> {
  final _controller = CitasController();
  final _iaPromptController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _controller.cargarCitas();
  }

  @override
  void dispose() {
    _controller.dispose();
    _iaPromptController.dispose();
    super.dispose();
  }

  void _enviarSolicitudIA() {
    final texto = _iaPromptController.text.trim();
    if (texto.isEmpty) return;
    _controller.procesarSolicitudIA(texto);
    _iaPromptController.clear();
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Citas & Agendamiento'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return ListView(
            padding: const EdgeInsets.all(AppTemas.espaciadoMd),
            children: [
              // Sección de Asistente IA (Consulta disponibilidad vía backend API)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppTemas.espaciadoMd),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.auto_awesome, color: AppTemas.acento),
                          const SizedBox(width: AppTemas.espaciadoSm),
                          Text('Asistente ORBIA AI', style: tema.textTheme.titleMedium),
                        ],
                      ),
                      const SizedBox(height: AppTemas.espaciadoXs),
                      Text(
                        'Pide una cita en lenguaje natural (ej. "quiero un corte mañana por la tarde")',
                        style: tema.textTheme.bodyMedium,
                      ),
                      const SizedBox(height: AppTemas.espaciadoMd),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _iaPromptController,
                              decoration: const InputDecoration(
                                hintText: 'Escribe tu solicitud aquí...',
                              ),
                              onSubmitted: (_) => _enviarSolicitudIA(),
                            ),
                          ),
                          const SizedBox(width: AppTemas.espaciadoSm),
                          IconButton.filled(
                            onPressed: _controller.cargando ? null : _enviarSolicitudIA,
                            icon: _controller.cargando
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  )
                                : const Icon(Icons.send),
                          ),
                        ],
                      ),

                      if (_controller.mensajeAsistente != null) ...[
                        const SizedBox(height: AppTemas.espaciadoMd),
                        Container(
                          padding: const EdgeInsets.all(AppTemas.espaciadoSm),
                          decoration: BoxDecoration(
                            color: AppTemas.primario.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(AppTemas.radioSm),
                            border: Border.all(color: AppTemas.primario),
                          ),
                          child: Text(_controller.mensajeAsistente!, style: tema.textTheme.bodyMedium),
                        ),
                      ],

                      if (_controller.horarioSugerido != null) ...[
                        const SizedBox(height: AppTemas.espaciadoSm),
                        ElevatedButton.icon(
                          onPressed: () => _controller.confirmarCita('carlos'),
                          icon: const Icon(Icons.check_circle_outline),
                          label: Text(
                            'Confirmar para ${_controller.horarioSugerido!['fecha']} a las ${_controller.horarioSugerido!['hora']}',
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppTemas.espaciadoLg),

              // Lista de Citas Agendadas
              Text('Historial de Citas', style: tema.textTheme.titleMedium),
              const SizedBox(height: AppTemas.espaciadoSm),

              if (_controller.citas.isEmpty)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                    child: Text('No tienes citas agendadas.', style: tema.textTheme.bodyMedium),
                  ),
                )
              else
                ..._controller.citas.map((c) => Padding(
                      padding: const EdgeInsets.only(bottom: AppTemas.espaciadoSm),
                      child: CitaCardWidget(
                        cita: c,
                        onCancelar: () => _controller.cancelarCita(c['id'].toString()),
                      ),
                    )),
            ],
          );
        },
      ),
    );
  }
}

