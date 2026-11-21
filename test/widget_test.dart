import 'package:flutter_test/flutter_test.dart';
import 'package:orbia/main.dart';

void main() {
  testWidgets('OrbiaApp arranca correctamente en Servicios y muestra la barra de navegación', (WidgetTester tester) async {
    await tester.pumpWidget(const OrbiaApp());
    await tester.pumpAndSettle();
    expect(find.text('Servicios'), findsWidgets);
    expect(find.text('Citas'), findsOneWidget);
    expect(find.text('Cuenta'), findsOneWidget);
  });
}
