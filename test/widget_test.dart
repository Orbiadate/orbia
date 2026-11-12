import 'package:flutter_test/flutter_test.dart';
import 'package:orbia/main.dart';

void main() {
  testWidgets('OrbiaApp arranca correctamente en la pantalla de login', (WidgetTester tester) async {
    await tester.pumpWidget(const OrbiaApp());
    await tester.pumpAndSettle();
    expect(find.text('ORBIA AI'), findsOneWidget);
    expect(find.text('Iniciar Sesión'), findsOneWidget);
  });
}
