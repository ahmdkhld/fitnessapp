import 'dart:io';

import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as p;

part 'app_database.g.dart';

// ---------------------------------------------------------------------------
// Table definitions
// ---------------------------------------------------------------------------

/// Cached daily timeline items (meals, supplements, workouts, water).
class CachedScheduleItems extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get date => text()(); // yyyy-MM-dd for easy grouping
  TextColumn get itemType => text()(); // meal | supplement | water | workout
  TextColumn get title => text()();
  TextColumn get subtitle => text().nullable()();
  DateTimeColumn get scheduledTime => dateTime()();
  TextColumn get status => text()();
  TextColumn get referenceId => text().nullable()();
  DateTimeColumn get syncedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Generic offline queue for requests that failed while the device was
/// offline. Rows are replayed in FIFO order once connectivity returns.
class OfflineQueue extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get endpoint => text()();
  TextColumn get method => text()(); // GET | POST | PUT | PATCH | DELETE
  TextColumn get body => text()(); // JSON-encoded request body
  DateTimeColumn get createdAt => dateTime().withDefault(currentDateAndTime)();
  IntColumn get retries => integer().withDefault(const Constant(0))();
}

/// Cached in-progress or completed workout sessions (full JSON blob).
class CachedWorkoutSessions extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get planId => text().nullable()();
  DateTimeColumn get startedAt => dateTime().nullable()();
  TextColumn get data => text()(); // JSON-encoded full session payload
  DateTimeColumn get syncedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Cached diet plans for the current user (full JSON blob).
class CachedDietPlans extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get data => text()(); // JSON-encoded plan payload
  DateTimeColumn get syncedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

/// Cached supplement plans for the current user (full JSON blob).
class CachedSupplementPlans extends Table {
  TextColumn get id => text()();
  TextColumn get userId => text()();
  TextColumn get data => text()(); // JSON-encoded plan payload
  DateTimeColumn get syncedAt => dateTime().withDefault(currentDateAndTime)();

  @override
  Set<Column> get primaryKey => {id};
}

// ---------------------------------------------------------------------------
// Database class
// ---------------------------------------------------------------------------

@DriftDatabase(tables: [
  CachedScheduleItems,
  OfflineQueue,
  CachedWorkoutSessions,
  CachedDietPlans,
  CachedSupplementPlans,
])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  /// Bump this number whenever the schema changes, and add a migration step
  /// inside [migration].
  @override
  int get schemaVersion => 1;

  @override
  MigrationStrategy get migration => MigrationStrategy(
        onCreate: (Migrator m) async {
          await m.createAll();
        },
        onUpgrade: (Migrator m, int from, int to) async {
          // Example for future migrations:
          // if (from < 2) {
          //   await m.addColumn(cachedScheduleItems, cachedScheduleItems.someNewCol);
          // }
        },
        beforeOpen: (details) async {
          // Enable foreign keys (disabled by default in SQLite).
          await customStatement('PRAGMA foreign_keys = ON');
        },
      );

  // -------------------------------------------------------------------------
  // Schedule-item helpers
  // -------------------------------------------------------------------------

  /// Return all cached schedule items for [userId] on [date] (yyyy-MM-dd).
  Future<List<CachedScheduleItem>> scheduleItemsFor(
    String userId,
    String date,
  ) {
    return (select(cachedScheduleItems)
          ..where((t) => t.userId.equals(userId) & t.date.equals(date))
          ..orderBy([(t) => OrderingTerm.asc(t.scheduledTime)]))
        .get();
  }

  /// Upsert a batch of schedule items for a given date, replacing any existing
  /// rows for the same user/date.
  Future<void> replaceScheduleItems(
    String userId,
    String date,
    List<CachedScheduleItemsCompanion> items,
  ) async {
    await transaction(() async {
      await (delete(cachedScheduleItems)
            ..where((t) => t.userId.equals(userId) & t.date.equals(date)))
          .go();
      await batch((b) {
        b.insertAll(cachedScheduleItems, items);
      });
    });
  }

  /// Update the status of a single cached schedule item.
  Future<void> updateScheduleItemStatus(String itemId, String status) {
    return (update(cachedScheduleItems)..where((t) => t.id.equals(itemId)))
        .write(CachedScheduleItemsCompanion(status: Value(status)));
  }

  // -------------------------------------------------------------------------
  // Offline-queue helpers
  // -------------------------------------------------------------------------

  /// Push an entry onto the offline queue.
  Future<int> enqueueOffline({
    required String endpoint,
    required String method,
    required String body,
  }) {
    return into(offlineQueue).insert(OfflineQueueCompanion.insert(
      endpoint: endpoint,
      method: method,
      body: body,
    ));
  }

  /// Return all queued entries ordered by creation time (FIFO).
  Future<List<OfflineQueueData>> pendingQueueEntries() {
    return (select(offlineQueue)
          ..orderBy([(t) => OrderingTerm.asc(t.createdAt)]))
        .get();
  }

  /// Remove a single queue entry after successful replay.
  Future<void> deleteQueueEntry(int id) {
    return (delete(offlineQueue)..where((t) => t.id.equals(id))).go();
  }

  /// Increment the retry counter for a failed replay attempt.
  Future<void> incrementRetries(int id) async {
    final entry =
        await (select(offlineQueue)..where((t) => t.id.equals(id))).getSingle();
    await (update(offlineQueue)..where((t) => t.id.equals(id)))
        .write(OfflineQueueCompanion(retries: Value(entry.retries + 1)));
  }

  /// Remove all queue entries (e.g. after a successful full drain).
  Future<void> clearQueue() => delete(offlineQueue).go();

  // -------------------------------------------------------------------------
  // Workout-session helpers
  // -------------------------------------------------------------------------

  Future<List<CachedWorkoutSession>> workoutSessionsFor(String userId) {
    return (select(cachedWorkoutSessions)
          ..where((t) => t.userId.equals(userId)))
        .get();
  }

  Future<void> upsertWorkoutSession(CachedWorkoutSessionsCompanion entry) {
    return into(cachedWorkoutSessions).insertOnConflictUpdate(entry);
  }

  // -------------------------------------------------------------------------
  // Diet-plan helpers
  // -------------------------------------------------------------------------

  Future<List<CachedDietPlan>> dietPlansFor(String userId) {
    return (select(cachedDietPlans)..where((t) => t.userId.equals(userId)))
        .get();
  }

  Future<void> upsertDietPlan(CachedDietPlansCompanion entry) {
    return into(cachedDietPlans).insertOnConflictUpdate(entry);
  }

  // -------------------------------------------------------------------------
  // Supplement-plan helpers
  // -------------------------------------------------------------------------

  Future<List<CachedSupplementPlan>> supplementPlansFor(String userId) {
    return (select(cachedSupplementPlans)
          ..where((t) => t.userId.equals(userId)))
        .get();
  }

  Future<void> upsertSupplementPlan(CachedSupplementPlansCompanion entry) {
    return into(cachedSupplementPlans).insertOnConflictUpdate(entry);
  }
}

// ---------------------------------------------------------------------------
// Connection helper
// ---------------------------------------------------------------------------

LazyDatabase _openConnection() {
  return LazyDatabase(() async {
    final dir = await getApplicationDocumentsDirectory();
    final file = File(p.join(dir.path, 'nutritrack.sqlite'));
    return NativeDatabase.createInBackground(file, logStatements: false);
  });
}
