import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'auth_controller.dart';

/// Pantalla de Cuenta / Perfil (Dominio Auth - Fase 7)
class CuentaView extends StatelessWidget {
  final AuthController? controller;

  const CuentaView({super.key, this.controller});

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);
    final auth = controller ?? AuthController();
    final usuario = auth.usuarioActual ?? {'nombre': 'Carlos Mendoza', 'correo': 'carlos@ejemplo.com'};
    final inicial = (usuario['nombre']?.toString().isNotEmpty ?? false)
        ? usuario['nombre'].toString()[0].toUpperCase()
        : 'U';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Cuenta'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTemas.espaciadoMd),
        children: [
          // Tarjeta de Identidad
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
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                  ),
                  const SizedBox(width: AppTemas.espaciadoMd),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(usuario['nombre']?.toString() ?? 'Usuario', style: tema.textTheme.titleMedium),
                        const SizedBox(height: 2),
                        Text(usuario['correo']?.toString() ?? '', style: tema.textTheme.bodyMedium),
                        const SizedBox(height: 4),
                        const Text('Miembro desde 2026', style: TextStyle(fontSize: 11, color: AppTemas.exito)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoLg),

          // Secciones de configuración
          Text('Configuración', style: tema.textTheme.titleSmall),
          const SizedBox(height: AppTemas.espaciadoSm),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.calendar_today_outlined, color: AppTemas.primario),
                  title: const Text('Mis Citas'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => Navigator.pushNamed(context, AppRutas.citas),
                ),
                const Divider(color: AppTemas.borde, height: 1),
                ListTile(
                  leading: const Icon(Icons.notifications_outlined, color: AppTemas.acento),
                  title: const Text('Notificaciones y Recordatorios'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
                const Divider(color: AppTemas.borde, height: 1),
                ListTile(
                  leading: const Icon(Icons.security_outlined, color: AppTemas.textoSecundario),
                  title: const Text('Privacidad y Seguridad'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoLg),

          // Botón de Cerrar Sesión
          OutlinedButton.icon(
            onPressed: () {
              auth.cerrarSesion();
              Navigator.pushNamedAndRemoveUntil(context, AppRutas.login, (r) => false);
            },
            icon: const Icon(Icons.logout, color: AppTemas.error),
            label: const Text('Cerrar Sesión', style: TextStyle(color: AppTemas.error)),
          ),
        ],
      ),
    );
  }
}

