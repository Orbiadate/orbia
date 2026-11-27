import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';
import 'estado_sesion.dart';

/// Pantalla de Inicio de Sesión de ORBIA (Fase 3: Autenticación)
class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _formKey = GlobalKey<FormState>();
  final _correoController = TextEditingController();
  final _contrasenaController = TextEditingController();
  bool _ocultarContrasena = true;

  @override
  void dispose() {
    _correoController.dispose();
    _contrasenaController.dispose();
    super.dispose();
  }

  Future<void> _enviarLogin() async {
    estadoSesion.limpiarError();
    if (!_formKey.currentState!.validate()) return;

    final correo = _correoController.text.trim();
    final pass = _contrasenaController.text;

    final exito = await estadoSesion.iniciarSesion(correo, pass);
    if (exito && mounted) {
      context.go('/servicios');
    }
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppTemas.gradienteFondo),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppTemas.espaciadoLg),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const Icon(Icons.lock_person_outlined, size: 48, color: AppTemas.primario),
                        const SizedBox(height: AppTemas.espaciadoSm),
                        Text(
                          'Iniciar Sesión',
                          style: tema.textTheme.titleLarge,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppTemas.espaciadoXs),
                        Text(
                          'Accede a tus citas y servicios en ORBIA',
                          style: tema.textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: AppTemas.espaciadoLg),

                        AnimatedBuilder(
                          animation: estadoSesion,
                          builder: (context, _) {
                            final err = estadoSesion.error;
                            if (err == null) return const SizedBox.shrink();
                            return Container(
                              margin: const EdgeInsets.only(bottom: AppTemas.espaciadoMd),
                              padding: const EdgeInsets.all(AppTemas.espaciadoSm),
                              decoration: BoxDecoration(
                                color: AppTemas.error.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(AppTemas.radioSm),
                                border: Border.all(color: AppTemas.error.withOpacity(0.5)),
                              ),
                              child: Text(
                                err,
                                style: const TextStyle(color: AppTemas.error, fontSize: 13),
                                textAlign: TextAlign.center,
                              ),
                            );
                          },
                        ),

                        TextFormField(
                          controller: _correoController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Correo Electrónico',
                            hintText: 'ejemplo@orbia.app',
                            prefixIcon: Icon(Icons.email_outlined),
                          ),
                          validator: (valor) {
                            final v = (valor ?? '').trim();
                            if (v.isEmpty) return 'El correo electrónico es obligatorio';
                            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(v)) {
                              return 'Ingresa un correo electrónico válido';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextFormField(
                          controller: _contrasenaController,
                          obscureText: _ocultarContrasena,
                          decoration: InputDecoration(
                            labelText: 'Contraseña',
                            prefixIcon: const Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _ocultarContrasena ? Icons.visibility_off : Icons.visibility,
                                color: AppTemas.textoSecundario,
                              ),
                              onPressed: () => setState(() => _ocultarContrasena = !_ocultarContrasena),
                            ),
                          ),
                          validator: (valor) {
                            if ((valor ?? '').isEmpty) return 'La contraseña es obligatoria';
                            return null;
                          },
                        ),
                        const SizedBox(height: AppTemas.espaciadoLg),

                        AnimatedBuilder(
                          animation: estadoSesion,
                          builder: (context, _) {
                            final cargando = estadoSesion.cargando;
                            return ElevatedButton(
                              onPressed: cargando ? null : _enviarLogin,
                              child: cargando
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                    )
                                  : const Text('Ingresar'),
                            );
                          },
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextButton(
                          onPressed: () {
                            estadoSesion.limpiarError();
                            context.go('/registro');
                          },
                          child: const Text('¿No tienes cuenta? Crear cuenta nueva'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
