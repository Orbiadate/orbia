import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/temas.dart';
import 'estado_sesion.dart';

/// Pantalla de Registro de Cuenta (Fase 3: Autenticación)
class RegistroView extends StatefulWidget {
  const RegistroView({super.key});

  @override
  State<RegistroView> createState() => _RegistroViewState();
}

class _RegistroViewState extends State<RegistroView> {
  final _formKey = GlobalKey<FormState>();
  final _nombreCtrl = TextEditingController();
  final _correoCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confCtrl = TextEditingController();
  bool _ocultarPass = true;
  bool _ocultarConf = true;

  @override
  void dispose() {
    _nombreCtrl.dispose();
    _correoCtrl.dispose();
    _passCtrl.dispose();
    _confCtrl.dispose();
    super.dispose();
  }

  Future<void> _enviarRegistro() async {
    estadoSesion.limpiarError();
    if (!_formKey.currentState!.validate()) return;

    final exito = await estadoSesion.registrar(
      nombre: _nombreCtrl.text.trim(),
      correo: _correoCtrl.text.trim(),
      contrasena: _passCtrl.text,
      confirmacion: _confCtrl.text,
    );

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
                        const Icon(Icons.person_add_alt_1_outlined, size: 44, color: AppTemas.primario),
                        const SizedBox(height: AppTemas.espaciadoSm),
                        Text('Crear Cuenta', style: tema.textTheme.titleLarge, textAlign: TextAlign.center),
                        const SizedBox(height: AppTemas.espaciadoXs),
                        Text('Regístrate para gestionar tus citas', style: tema.textTheme.bodyMedium, textAlign: TextAlign.center),
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
                              child: Text(err, style: const TextStyle(color: AppTemas.error, fontSize: 13), textAlign: TextAlign.center),
                            );
                          },
                        ),

                        TextFormField(
                          controller: _nombreCtrl,
                          decoration: const InputDecoration(labelText: 'Nombre Completo', prefixIcon: Icon(Icons.badge_outlined)),
                          validator: (v) => (v ?? '').trim().isEmpty ? 'El nombre es obligatorio' : null,
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextFormField(
                          controller: _correoCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(labelText: 'Correo Electrónico', prefixIcon: Icon(Icons.email_outlined)),
                          validator: (v) {
                            final val = (v ?? '').trim();
                            if (val.isEmpty) return 'El correo es obligatorio';
                            if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(val)) return 'Ingresa un correo válido';
                            return null;
                          },
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextFormField(
                          controller: _passCtrl,
                          obscureText: _ocultarPass,
                          decoration: InputDecoration(
                            labelText: 'Contraseña (mín. 8 caracteres)',
                            prefixIcon: const Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              icon: Icon(_ocultarPass ? Icons.visibility_off : Icons.visibility, color: AppTemas.textoSecundario),
                              onPressed: () => setState(() => _ocultarPass = !_ocultarPass),
                            ),
                          ),
                          validator: (v) => (v ?? '').length < 8 ? 'Mínimo 8 caracteres' : null,
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextFormField(
                          controller: _confCtrl,
                          obscureText: _ocultarConf,
                          decoration: InputDecoration(
                            labelText: 'Confirmar Contraseña',
                            prefixIcon: const Icon(Icons.lock_reset_outlined),
                            suffixIcon: IconButton(
                              icon: Icon(_ocultarConf ? Icons.visibility_off : Icons.visibility, color: AppTemas.textoSecundario),
                              onPressed: () => setState(() => _ocultarConf = !_ocultarConf),
                            ),
                          ),
                          validator: (v) => v != _passCtrl.text ? 'Las contraseñas no coinciden' : null,
                        ),
                        const SizedBox(height: AppTemas.espaciadoLg),

                        AnimatedBuilder(
                          animation: estadoSesion,
                          builder: (context, _) {
                            final cargando = estadoSesion.cargando;
                            return ElevatedButton(
                              onPressed: cargando ? null : _enviarRegistro,
                              child: cargando
                                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                  : const Text('Crear Cuenta'),
                            );
                          },
                        ),
                        const SizedBox(height: AppTemas.espaciadoMd),

                        TextButton(
                          onPressed: () {
                            estadoSesion.limpiarError();
                            context.go('/login');
                          },
                          child: const Text('¿Ya tienes cuenta? Inicia sesión aquí'),
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
