import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';
import 'estado_sesion.dart';

/// Pantalla de Cuenta / Perfil de Usuario (Pestaña Cuenta - Fase 3)
class CuentaView extends StatelessWidget {
  const CuentaView({super.key});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Cuenta'),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 500),
          child: AnimatedBuilder(
            animation: estadoSesion,
            builder: (context, _) {
              final nombre = estadoSesion.nombreUsuario;
              final correo = estadoSesion.correoUsuario;
              final inicial = nombre.isNotEmpty ? nombre[0].toUpperCase() : 'U';

              return ListView(
                padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 32,
                            backgroundColor: AppTemas.primario,
                            child: Text(
                              inicial,
                              style: const TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: AppTemas.espaciadoLg),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  nombre,
                                  style: tema.textTheme.titleMedium?.copyWith(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  correo.isNotEmpty ? correo : 'Sin correo registrado',
                                  style: tema.textTheme.bodyMedium?.copyWith(
                                    color: AppTemas.textoSecundario,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppTemas.espaciadoLg),

                  ListTile(
                    leading: const Icon(Icons.shield_outlined, color: AppTemas.primario),
                    title: const Text('Sesión Segura'),
                    subtitle: const Text('Autenticado mediante JWT y bcrypt'),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTemas.radioSm),
                    ),
                  ),
                  const Divider(color: AppTemas.borde),
                  const SizedBox(height: AppTemas.espaciadoLg),

                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTemas.error,
                      side: const BorderSide(color: AppTemas.error),
                      padding: const EdgeInsets.symmetric(vertical: AppTemas.espaciadoMd),
                    ),
                    onPressed: () {
                      estadoSesion.cerrarSesion();
                      context.go('/login');
                    },
                    icon: const Icon(Icons.logout, color: AppTemas.error),
                    label: const Text('Cerrar Sesión', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
