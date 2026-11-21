import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'widgets/shell_scaffold.dart';
import '../features/auth/login.dart';
import '../features/auth/cuenta.dart';
import '../features/servicios/servicios.dart';
import '../features/citas/citas.dart';
import '../features/local/local.dart';
import '../features/lugar/lugar.dart';

final GlobalKey<NavigatorState> _rootNavigatorKey = GlobalKey<NavigatorState>();

/// Sistema declarativo de rutas de ORBIA mediante go_router (Fase 2)
class AppRutas {
  AppRutas._();

  static const String servicios = '/servicios';
  static const String citas = '/citas';
  static const String cuenta = '/cuenta';
  static const String auth = '/auth';
  static const String local = '/local';
  static const String lugar = '/lugar';

  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: servicios,
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
        path: auth,
        name: 'auth',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const LoginView(),
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
