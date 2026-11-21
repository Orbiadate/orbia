import 'package:flutter/material.dart';
import '../../core/temas.dart';
import '../../core/rutas.dart';
import 'auth_controller.dart';

/// Pantalla de Registro de Usuario (Dominio Auth - Fase 7)
class RegistroView extends StatefulWidget {
  const RegistroView({super.key});

  @override
  State<RegistroView> createState() => _RegistroViewState();
}

class _RegistroViewState extends State<RegistroView> {
  final _nombreController = TextEditingController();
  final _correoController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authController = AuthController();
  bool _terminosAceptados = true;

  @override
  void dispose() {
    _nombreController.dispose();
    _correoController.dispose();
    _passwordController.dispose();
    _authController.dispose();
    super.dispose();
  }

  void _manejarRegistro() async {
    final nombre = _nombreController.text.trim();
    final correo = _correoController.text.trim();
    final password = _passwordController.text.trim();

    if (nombre.isEmpty || correo.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor completa todos los campos')),
      );
      return;
    }

    final ok = await _authController.registrar(nombre, correo, password);
    if (ok && mounted) {
      Navigator.pushReplacementNamed(context, AppRutas.servicios);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Crear Cuenta'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Container(
        decoration: const BoxDecoration(gradient: AppTemas.gradienteFondo),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: AppTemas.espaciadoLg),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(AppTemas.espaciadoLg),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text('Únete a ORBIA', style: tema.textTheme.titleLarge, textAlign: TextAlign.center),
                        const SizedBox(height: 4),
                        Text('Gestiona tus citas en segundos', style: tema.textTheme.bodyMedium, textAlign: TextAlign.center),
                        const SizedBox(height: AppTemas.espaciadoLg),

                        AnimatedBuilder(
                          animation: _authController,
                          builder: (context, _) {
                            if (_authController.error != null) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: AppTemas.espaciadoMd),
                                child: Text(
                                  _authController.error!,
                                  style: const TextStyle(color: AppTemas.error),
                                  textAlign: TextAlign.center,
                                ),
                              );
                            }
                            return const SizedBox.shrink();
                          },
                        ),

                        TextFormField(
                          controller: _nombreController,
                          decoration: const InputDecoration(
                            labelText: 'Nombre Completo',
                            prefixIcon: Icon(Icons.person_outline),
                          ),
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),
                        TextFormField(
                          controller: _correoController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            labelText: 'Correo Electrónico',
                            prefixIcon: Icon(Icons.email_outlined),
                          ),
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),
                        TextFormField(
                          controller: _passwordController,
                          obscureText: true,
                          decoration: const InputDecoration(
                            labelText: 'Contraseña (mínimo 8 caracteres)',
                            prefixIcon: Icon(Icons.lock_outline),
                          ),
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        CheckboxListTile(
                          contentPadding: EdgeInsets.zero,
                          value: _terminosAceptados,
                          onChanged: (val) => setState(() => _terminosAceptados = val ?? false),
                          title: Text('Acepto términos y aviso de privacidad', style: tema.textTheme.bodySmall),
                          controlAffinity: ListTileControlAffinity.leading,
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        ElevatedButton(
                          onPressed: _terminosAceptados ? _manejarRegistro : null,
                          child: const Text('Crear Cuenta'),
                        ),
                        const SizedBox(height: AppTemas.espaciadoSm),
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('¿Ya tienes cuenta? Inicia sesión'),
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

