/// Unit-system helpers. Everything in the app is stored in kg internally;
/// the UI layer reads the user's `unit_system` field from the profile and
/// formats/parses via these helpers.
enum UnitSystem { metric, imperial }

extension UnitSystemParse on UnitSystem {
  static UnitSystem parse(String? raw) =>
      raw == 'imperial' ? UnitSystem.imperial : UnitSystem.metric;

  bool get isImperial => this == UnitSystem.imperial;
}

class UnitConverter {
  const UnitConverter(this.system);
  final UnitSystem system;

  static const _kgToLbs = 2.20462;

  /// Convert kg from storage into the user's preferred display value.
  double displayWeight(double kg) =>
      system.isImperial ? _round(kg * _kgToLbs, 1) : _round(kg, 1);

  /// Parse user-entered weight and store as kg.
  double? parseWeight(String input) {
    final parsed = double.tryParse(input.trim());
    if (parsed == null) return null;
    return system.isImperial ? _round(parsed / _kgToLbs, 2) : parsed;
  }

  String weightLabel(double kg) {
    final display = displayWeight(kg);
    return '$display ${system.isImperial ? "lbs" : "kg"}';
  }

  String get weightUnit => system.isImperial ? 'lbs' : 'kg';

  // ---- distance ----
  static const _kmToMi = 0.621371;

  double displayDistance(double km) =>
      system.isImperial ? _round(km * _kmToMi, 2) : _round(km, 2);

  String distanceLabel(double km) {
    final display = displayDistance(km);
    return '$display ${system.isImperial ? "mi" : "km"}';
  }

  String get distanceUnit => system.isImperial ? 'mi' : 'km';

  double _round(double v, int decimals) {
    final m = 1.0 * (decimals == 1 ? 10 : 100);
    return (v * m).round() / m;
  }
}
