import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'widgets/shell_scaffold.dart';
import '../features/auth/login.dart';
import '../features/auth/registro.dart';
import '../features/auth/cuenta.dart';
import '../features/auth/estado_sesion.dart';
import '../features/servicios/servicios.dart';
import '../features/citas/citas.dart';
import '../features/local/local.dart';
import '../features/lugar/lugar.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

/// Sistema declarativo de rutas de ORBIA con protección de sesión (Fase 3)
class AppRutas {
  AppRutas._();

  static const String servicios = '/servicios';
  static const String citas = '/citas';
  static const String cuenta = '/cuenta';
  static const String login = '/login';
  static const String registro = '/registro';
  static const String local = '/local';
  static const String lugar = '/lugar';

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: servicios,
    refreshListenable: estadoSesion,
    redirect: (context, state) {
      final autenticado = estadoSesion.estaAutenticado;
      final loc = state.matchedLocation;
      final esRutaPublica = loc == login || loc == registro;

      if (!autenticado && !esRutaPublica) {
        return login;
      }

      if (autenticado && esRutaPublica) {
        return servicios;
      }

      return null;
    },
    routes: [
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return ShellScaffold(navigationShell: navigationShell);
        },
        branches: [
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: servicios,
                name: 'servicios',
                builder: (context, state) => const ServiciosView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: citas,
                name: 'citas',
                builder: (context, state) => const CitasView(),
              ),
            ],
          ),
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: cuenta,
                name: 'cuenta',
                builder: (context, state) => const CuentaView(),
              ),
            ],
          ),
        ],
      ),
      GoRoute(
        path: login,
        name: 'login',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LoginView(),
      ),
      GoRoute(
        path: registro,
        name: 'registro',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const RegistroView(),
      ),
      GoRoute(
        path: local,
        name: 'local',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LocalView(),
      ),
      GoRoute(
        path: lugar,
        name: 'lugar',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LugarView(),
      ),
    ],
  );
}
