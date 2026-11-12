import 'package:flutter/material.dart';
import '../../../core/temas.dart';

class AuthFormWidget extends StatelessWidget {
  final TextEditingController correoController;
  final TextEditingController passwordController;
  final bool cargando;
  final String? error;
  final VoidCallback onIngresar;
  final VoidCallback onInvitado;

  const AuthFormWidget({
    super.key,
    required this.correoController,
    required this.passwordController,
    required this.cargando,
    this.error,
    required this.onIngresar,
    required this.onInvitado,
  });

  @override
  Widget build(BuildContext context) {
    final tema = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (error != null) ...[
          Container(
            padding: const EdgeInsets.all(AppTemas.espaciadoSm),
            decoration: BoxDecoration(
              color: AppTemas.error.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(AppTemas.radioSm),
              border: Border.all(color: AppTemas.error),
            ),
            child: Text(
              error!,
              style: tema.textTheme.bodyMedium?.copyWith(color: AppTemas.error),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: AppTemas.espaciadoMd),
        ],
        TextFormField(
          controller: correoController,
          keyboardType: TextInputType.emailAddress,
          decoration: const InputDecoration(
            labelText: 'Correo Electrónico',
            hintText: 'ejemplo@correo.com',
            prefixIcon: Icon(Icons.email_outlined),
          ),
        ),
        const SizedBox(height: AppTemas.espaciadoMd),
        TextFormField(
          controller: passwordController,
          obscureText: true,
          decoration: const InputDecoration(
            labelText: 'Contraseña',
            hintText: '••••••••',
            prefixIcon: Icon(Icons.lock_outline),
          ),
        ),
        const SizedBox(height: AppTemas.espaciadoLg),
        ElevatedButton(
          onPressed: cargando ? null : onIngresar,
          child: cargando
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                )
              : const Text('Iniciar Sesión'),
        ),
        const SizedBox(height: AppTemas.espaciadoSm),
        OutlinedButton(
          onPressed: onInvitado,
          child: const Text('Continuar como Invitado'),
        ),
      ],
    );
  }
}

