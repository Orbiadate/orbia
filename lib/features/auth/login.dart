import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'auth_controller.dart';
import 'widgets/auth_form_widget.dart';

/// Landing View con inicio de sesión (Requisito 6)
class LoginView extends StatefulWidget {
  const LoginView({super.key});

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  final _correoController = TextEditingController(text: 'carlos@ejemplo.com');
  final _passwordController = TextEditingController(text: 'Password123');
  final _authController = AuthController();

  @override
  void dispose() {
    _correoController.dispose();
    _passwordController.dispose();
    _authController.dispose();
    super.dispose();
  }

  void _manejarLogin() async {
    final ok = await _authController.iniciarSesion(
      _correoController.text.trim(),
      _passwordController.text.trim(),
    );
    if (ok && mounted) {
      Navigator.pushReplacementNamed(context, AppRutas.servicios);
    }
  }

  void _manejarInvitado() {
    _authController.modoInvitado();
    Navigator.pushReplacementNamed(context, AppRutas.servicios);
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppTemas.gradienteFondo),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: AppTemas.espaciadoLg),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Cabecera de Marca
                    Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          gradient: AppTemas.gradientePrimario,
                          borderRadius: BorderRadius.circular(AppTemas.radioPill),
                        ),
                        child: const Text(
                          'ORBIA AI',
                          style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 1.5, fontSize: 12),
                        ),
                      ),
                    ),
                    const SizedBox(height: AppTemas.espaciadoMd),
                    Text(
                      'Agenda inteligente de citas',
                      style: tema.textTheme.displayLarge?.copyWith(fontSize: 28),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppTemas.espaciadoXs),
                    Text(
                      'Ingresa a tu cuenta para gestionar tus reservas',
                      style: tema.textTheme.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppTemas.espaciadoLg),

                    // Tarjeta de Formulario
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                        child: AnimatedBuilder(
                          animation: _authController,
                          builder: (context, _) => AuthFormWidget(
                            correoController: _correoController,
                            passwordController: _passwordController,
                            cargando: _authController.cargando,
                            error: _authController.error,
                            onIngresar: _manejarLogin,
                            onInvitado: _manejarInvitado,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

