import 'package:flutter/material.dart';
import '../features/auth/login.dart';
import '../features/servicios/servicios.dart';
import '../features/local/local.dart';
import '../features/lugar/lugar.dart';
import '../features/citas/citas.dart';

/// Registro central de rutas por dominios (Requisito 7)
class AppRutas {
  AppRutas._();

  static const String login = '/';
  static const String servicios = '/servicios';
  static const String local = '/local';
  static const String lugar = '/lugar';
  static const String citas = '/citas';

  static Map<String, WidgetBuilder> get rutas => {
        login: (context) => const LoginView(),
        servicios: (context) => const ServiciosView(),
        local: (context) => const LocalView(),
        lugar: (context) => const LugarView(),
        citas: (context) => const CitasView(),
      };
}

