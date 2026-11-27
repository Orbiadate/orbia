import 'package:flutter_test/flutter_test.dart';
import 'package:orbia/main.dart';
import 'package:orbia/features/auth/estado_sesion.dart';

void main() {
  testWidgets('Sin sesion, la app muestra la pantalla de Iniciar Sesion', (WidgetTester tester) async {
    estadoSesion.cerrarSesion();
    await tester.pumpWidget(const OrbiaApp());
    await tester.pumpAndSettle();

    expect(find.text('Iniciar Sesión'), findsWidgets);
    expect(find.text('Correo Electrónico'), findsOneWidget);
    expect(find.text('Contraseña'), findsOneWidget);
    expect(find.text('Ingresar'), findsOneWidget);
  });
}
