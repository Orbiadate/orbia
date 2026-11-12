import 'package:flutter/material.dart';

/// Centralización absoluta de estilos de ORBIA (Requisito 5).
/// Toda la apariencia visual (colores, tipografía, bordes, tamaños y ThemeData)
/// reside en este archivo. Las vistas consumen este tema y no declaran estilos propios.
class AppTemas {
  AppTemas._();

  // Paleta de Colores
  static const Color fondo = Color(0xFF070B16);
  static const Color fondoSecundario = Color(0xFF0D1424);
  static const Color superficie = Color(0xFF1E293B);
  static const Color primario = Color(0xFF6366F1);
  static const Color acento = Color(0xFFA855F7);
  static const Color textoClaro = Colors.white;
  static const Color textoSecundario = Color(0xFF94A3B8);
  static const Color textoAtenuado = Color(0xFF64748B);
  static const Color borde = Color(0x2494A3B8);
  static const Color exito = Color(0xFF22C55E);
  static const Color error = Color(0xFFEF4444);
  static const Color advertencia = Color(0xFFFBBF24);

  // Dimensiones y Espaciados Estándar
  static const double espaciadoXs = 6.0;
  static const double espaciadoSm = 8.0;
  static const double espaciadoMd = 16.0;
  static const double espaciadoLg = 24.0;

  static const double radioSm = 10.0;
  static const double radioMd = 14.0;
  static const double radioLg = 18.0;
  static const double radioPill = 999.0;

  static const double alturaBoton = 48.0;
  static const double alturaCampo = 48.0;

  // Gradiente corporativo ORBIA
  static const LinearGradient gradientePrimario = LinearGradient(
    colors: [primario, acento],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient gradienteFondo = LinearGradient(
    colors: [Color(0xFF1B2050), Color(0xFF0D1424)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  /// Genera el ThemeData principal de la aplicación
  static ThemeData get temaOscuro {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: fondo,
      colorScheme: const ColorScheme.dark(
        primary: primario,
        secondary: acento,
        surface: superficie,
        error: error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: textoClaro,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: textoClaro,
          fontSize: 22,
          fontWeight: FontWeight.w800,
        ),
        iconTheme: IconThemeData(color: textoClaro),
      ),
      cardTheme: CardThemeData(
        color: superficie,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radioLg),
          side: const BorderSide(color: borde, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: fondoSecundario,
        contentPadding: const EdgeInsets.symmetric(horizontal: espaciadoMd, vertical: espaciadoSm),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radioMd),
          borderSide: const BorderSide(color: borde),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radioMd),
          borderSide: const BorderSide(color: borde),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radioMd),
          borderSide: const BorderSide(color: primario, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radioMd),
          borderSide: const BorderSide(color: error),
        ),
        hintStyle: const TextStyle(color: textoAtenuado, fontSize: 14),
        labelStyle: const TextStyle(color: textoSecundario, fontSize: 13, fontWeight: FontWeight.w600),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primario,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(alturaBoton),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radioMd),
          ),
          textStyle: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: Colors.white,
          side: const BorderSide(color: borde),
          minimumSize: const Size.fromHeight(alturaBoton),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radioMd),
          ),
          textStyle: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      textTheme: const TextTheme(
        displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w800, color: textoClaro, letterSpacing: -0.5),
        titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: textoClaro),
        titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: textoClaro),
        titleSmall: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: textoSecundario),
        bodyLarge: TextStyle(fontSize: 15, fontWeight: FontWeight.w400, color: textoClaro),
        bodyMedium: TextStyle(fontSize: 13, fontWeight: FontWeight.w400, color: textoSecundario),
        bodySmall: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: textoAtenuado),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: Color(0xEF0D1424),
        selectedItemColor: textoClaro,
        unselectedItemColor: textoSecundario,
        selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
    );
  }
}
