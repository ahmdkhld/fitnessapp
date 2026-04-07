class Exercise {
  const Exercise({
    required this.id,
    required this.name,
    this.category,
    this.primaryMuscle,
    this.secondaryMuscles = const [],
    this.equipment,
    this.isUnilateral = false,
    this.isCardio = false,
    this.instructions,
    this.userId,
  });

  final String id;
  final String? userId;
  final String name;
  final String? category;
  final String? primaryMuscle;
  final List<String> secondaryMuscles;
  final String? equipment;
  final bool isUnilateral;
  final bool isCardio;
  final String? instructions;

  bool get isLibrary => userId == null;

  factory Exercise.fromJson(Map<String, dynamic> json) => Exercise(
        id: json['id'] as String,
        userId: json['userId'] as String?,
        name: json['name'] as String,
        category: json['category'] as String?,
        primaryMuscle: json['primaryMuscle'] as String?,
        secondaryMuscles:
            ((json['secondaryMuscles'] as List?) ?? const []).cast<String>(),
        equipment: json['equipment'] as String?,
        isUnilateral: json['isUnilateral'] as bool? ?? false,
        isCardio: json['isCardio'] as bool? ?? false,
        instructions: json['instructions'] as String?,
      );
}
