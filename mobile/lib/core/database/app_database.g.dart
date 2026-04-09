// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $CachedScheduleItemsTable extends CachedScheduleItems
    with TableInfo<$CachedScheduleItemsTable, CachedScheduleItem> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedScheduleItemsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
      'user_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<String> date = GeneratedColumn<String>(
      'date', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _itemTypeMeta =
      const VerificationMeta('itemType');
  @override
  late final GeneratedColumn<String> itemType = GeneratedColumn<String>(
      'item_type', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _subtitleMeta =
      const VerificationMeta('subtitle');
  @override
  late final GeneratedColumn<String> subtitle = GeneratedColumn<String>(
      'subtitle', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _scheduledTimeMeta =
      const VerificationMeta('scheduledTime');
  @override
  late final GeneratedColumn<DateTime> scheduledTime =
      GeneratedColumn<DateTime>('scheduled_time', aliasedName, false,
          type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumn<String> status = GeneratedColumn<String>(
      'status', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _referenceIdMeta =
      const VerificationMeta('referenceId');
  @override
  late final GeneratedColumn<String> referenceId = GeneratedColumn<String>(
      'reference_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _syncedAtMeta =
      const VerificationMeta('syncedAt');
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
      'synced_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        userId,
        date,
        itemType,
        title,
        subtitle,
        scheduledTime,
        status,
        referenceId,
        syncedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_schedule_items';
  @override
  VerificationContext validateIntegrity(Insertable<CachedScheduleItem> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('item_type')) {
      context.handle(_itemTypeMeta,
          itemType.isAcceptableOrUnknown(data['item_type']!, _itemTypeMeta));
    } else if (isInserting) {
      context.missing(_itemTypeMeta);
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('subtitle')) {
      context.handle(_subtitleMeta,
          subtitle.isAcceptableOrUnknown(data['subtitle']!, _subtitleMeta));
    }
    if (data.containsKey('scheduled_time')) {
      context.handle(
          _scheduledTimeMeta,
          scheduledTime.isAcceptableOrUnknown(
              data['scheduled_time']!, _scheduledTimeMeta));
    } else if (isInserting) {
      context.missing(_scheduledTimeMeta);
    }
    if (data.containsKey('status')) {
      context.handle(_statusMeta,
          status.isAcceptableOrUnknown(data['status']!, _statusMeta));
    } else if (isInserting) {
      context.missing(_statusMeta);
    }
    if (data.containsKey('reference_id')) {
      context.handle(
          _referenceIdMeta,
          referenceId.isAcceptableOrUnknown(
              data['reference_id']!, _referenceIdMeta));
    }
    if (data.containsKey('synced_at')) {
      context.handle(_syncedAtMeta,
          syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedScheduleItem map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedScheduleItem(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}user_id'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}date'])!,
      itemType: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}item_type'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      subtitle: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}subtitle']),
      scheduledTime: attachedDatabase.typeMapping.read(
          DriftSqlType.dateTime, data['${effectivePrefix}scheduled_time'])!,
      status: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}status'])!,
      referenceId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}reference_id']),
      syncedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}synced_at'])!,
    );
  }

  @override
  $CachedScheduleItemsTable createAlias(String alias) {
    return $CachedScheduleItemsTable(attachedDatabase, alias);
  }
}

class CachedScheduleItem extends DataClass
    implements Insertable<CachedScheduleItem> {
  final String id;
  final String userId;
  final String date;
  final String itemType;
  final String title;
  final String? subtitle;
  final DateTime scheduledTime;
  final String status;
  final String? referenceId;
  final DateTime syncedAt;
  const CachedScheduleItem(
      {required this.id,
      required this.userId,
      required this.date,
      required this.itemType,
      required this.title,
      this.subtitle,
      required this.scheduledTime,
      required this.status,
      this.referenceId,
      required this.syncedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['date'] = Variable<String>(date);
    map['item_type'] = Variable<String>(itemType);
    map['title'] = Variable<String>(title);
    if (!nullToAbsent || subtitle != null) {
      map['subtitle'] = Variable<String>(subtitle);
    }
    map['scheduled_time'] = Variable<DateTime>(scheduledTime);
    map['status'] = Variable<String>(status);
    if (!nullToAbsent || referenceId != null) {
      map['reference_id'] = Variable<String>(referenceId);
    }
    map['synced_at'] = Variable<DateTime>(syncedAt);
    return map;
  }

  CachedScheduleItemsCompanion toCompanion(bool nullToAbsent) {
    return CachedScheduleItemsCompanion(
      id: Value(id),
      userId: Value(userId),
      date: Value(date),
      itemType: Value(itemType),
      title: Value(title),
      subtitle: subtitle == null && nullToAbsent
          ? const Value.absent()
          : Value(subtitle),
      scheduledTime: Value(scheduledTime),
      status: Value(status),
      referenceId: referenceId == null && nullToAbsent
          ? const Value.absent()
          : Value(referenceId),
      syncedAt: Value(syncedAt),
    );
  }

  factory CachedScheduleItem.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedScheduleItem(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      date: serializer.fromJson<String>(json['date']),
      itemType: serializer.fromJson<String>(json['itemType']),
      title: serializer.fromJson<String>(json['title']),
      subtitle: serializer.fromJson<String?>(json['subtitle']),
      scheduledTime: serializer.fromJson<DateTime>(json['scheduledTime']),
      status: serializer.fromJson<String>(json['status']),
      referenceId: serializer.fromJson<String?>(json['referenceId']),
      syncedAt: serializer.fromJson<DateTime>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'date': serializer.toJson<String>(date),
      'itemType': serializer.toJson<String>(itemType),
      'title': serializer.toJson<String>(title),
      'subtitle': serializer.toJson<String?>(subtitle),
      'scheduledTime': serializer.toJson<DateTime>(scheduledTime),
      'status': serializer.toJson<String>(status),
      'referenceId': serializer.toJson<String?>(referenceId),
      'syncedAt': serializer.toJson<DateTime>(syncedAt),
    };
  }

  CachedScheduleItem copyWith(
          {String? id,
          String? userId,
          String? date,
          String? itemType,
          String? title,
          Value<String?> subtitle = const Value.absent(),
          DateTime? scheduledTime,
          String? status,
          Value<String?> referenceId = const Value.absent(),
          DateTime? syncedAt}) =>
      CachedScheduleItem(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        date: date ?? this.date,
        itemType: itemType ?? this.itemType,
        title: title ?? this.title,
        subtitle: subtitle.present ? subtitle.value : this.subtitle,
        scheduledTime: scheduledTime ?? this.scheduledTime,
        status: status ?? this.status,
        referenceId: referenceId.present ? referenceId.value : this.referenceId,
        syncedAt: syncedAt ?? this.syncedAt,
      );
  CachedScheduleItem copyWithCompanion(CachedScheduleItemsCompanion data) {
    return CachedScheduleItem(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      date: data.date.present ? data.date.value : this.date,
      itemType: data.itemType.present ? data.itemType.value : this.itemType,
      title: data.title.present ? data.title.value : this.title,
      subtitle: data.subtitle.present ? data.subtitle.value : this.subtitle,
      scheduledTime: data.scheduledTime.present
          ? data.scheduledTime.value
          : this.scheduledTime,
      status: data.status.present ? data.status.value : this.status,
      referenceId:
          data.referenceId.present ? data.referenceId.value : this.referenceId,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedScheduleItem(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('date: $date, ')
          ..write('itemType: $itemType, ')
          ..write('title: $title, ')
          ..write('subtitle: $subtitle, ')
          ..write('scheduledTime: $scheduledTime, ')
          ..write('status: $status, ')
          ..write('referenceId: $referenceId, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, userId, date, itemType, title, subtitle,
      scheduledTime, status, referenceId, syncedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedScheduleItem &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.date == this.date &&
          other.itemType == this.itemType &&
          other.title == this.title &&
          other.subtitle == this.subtitle &&
          other.scheduledTime == this.scheduledTime &&
          other.status == this.status &&
          other.referenceId == this.referenceId &&
          other.syncedAt == this.syncedAt);
}

class CachedScheduleItemsCompanion extends UpdateCompanion<CachedScheduleItem> {
  final Value<String> id;
  final Value<String> userId;
  final Value<String> date;
  final Value<String> itemType;
  final Value<String> title;
  final Value<String?> subtitle;
  final Value<DateTime> scheduledTime;
  final Value<String> status;
  final Value<String?> referenceId;
  final Value<DateTime> syncedAt;
  final Value<int> rowid;
  const CachedScheduleItemsCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.date = const Value.absent(),
    this.itemType = const Value.absent(),
    this.title = const Value.absent(),
    this.subtitle = const Value.absent(),
    this.scheduledTime = const Value.absent(),
    this.status = const Value.absent(),
    this.referenceId = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedScheduleItemsCompanion.insert({
    required String id,
    required String userId,
    required String date,
    required String itemType,
    required String title,
    this.subtitle = const Value.absent(),
    required DateTime scheduledTime,
    required String status,
    this.referenceId = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        userId = Value(userId),
        date = Value(date),
        itemType = Value(itemType),
        title = Value(title),
        scheduledTime = Value(scheduledTime),
        status = Value(status);
  static Insertable<CachedScheduleItem> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<String>? date,
    Expression<String>? itemType,
    Expression<String>? title,
    Expression<String>? subtitle,
    Expression<DateTime>? scheduledTime,
    Expression<String>? status,
    Expression<String>? referenceId,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (date != null) 'date': date,
      if (itemType != null) 'item_type': itemType,
      if (title != null) 'title': title,
      if (subtitle != null) 'subtitle': subtitle,
      if (scheduledTime != null) 'scheduled_time': scheduledTime,
      if (status != null) 'status': status,
      if (referenceId != null) 'reference_id': referenceId,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedScheduleItemsCompanion copyWith(
      {Value<String>? id,
      Value<String>? userId,
      Value<String>? date,
      Value<String>? itemType,
      Value<String>? title,
      Value<String?>? subtitle,
      Value<DateTime>? scheduledTime,
      Value<String>? status,
      Value<String?>? referenceId,
      Value<DateTime>? syncedAt,
      Value<int>? rowid}) {
    return CachedScheduleItemsCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      date: date ?? this.date,
      itemType: itemType ?? this.itemType,
      title: title ?? this.title,
      subtitle: subtitle ?? this.subtitle,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      status: status ?? this.status,
      referenceId: referenceId ?? this.referenceId,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (date.present) {
      map['date'] = Variable<String>(date.value);
    }
    if (itemType.present) {
      map['item_type'] = Variable<String>(itemType.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (subtitle.present) {
      map['subtitle'] = Variable<String>(subtitle.value);
    }
    if (scheduledTime.present) {
      map['scheduled_time'] = Variable<DateTime>(scheduledTime.value);
    }
    if (status.present) {
      map['status'] = Variable<String>(status.value);
    }
    if (referenceId.present) {
      map['reference_id'] = Variable<String>(referenceId.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedScheduleItemsCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('date: $date, ')
          ..write('itemType: $itemType, ')
          ..write('title: $title, ')
          ..write('subtitle: $subtitle, ')
          ..write('scheduledTime: $scheduledTime, ')
          ..write('status: $status, ')
          ..write('referenceId: $referenceId, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $OfflineQueueTable extends OfflineQueue
    with TableInfo<$OfflineQueueTable, OfflineQueueData> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $OfflineQueueTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _endpointMeta =
      const VerificationMeta('endpoint');
  @override
  late final GeneratedColumn<String> endpoint = GeneratedColumn<String>(
      'endpoint', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _methodMeta = const VerificationMeta('method');
  @override
  late final GeneratedColumn<String> method = GeneratedColumn<String>(
      'method', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _bodyMeta = const VerificationMeta('body');
  @override
  late final GeneratedColumn<String> body = GeneratedColumn<String>(
      'body', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  static const VerificationMeta _retriesMeta =
      const VerificationMeta('retries');
  @override
  late final GeneratedColumn<int> retries = GeneratedColumn<int>(
      'retries', aliasedName, false,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  @override
  List<GeneratedColumn> get $columns =>
      [id, endpoint, method, body, createdAt, retries];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'offline_queue';
  @override
  VerificationContext validateIntegrity(Insertable<OfflineQueueData> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('endpoint')) {
      context.handle(_endpointMeta,
          endpoint.isAcceptableOrUnknown(data['endpoint']!, _endpointMeta));
    } else if (isInserting) {
      context.missing(_endpointMeta);
    }
    if (data.containsKey('method')) {
      context.handle(_methodMeta,
          method.isAcceptableOrUnknown(data['method']!, _methodMeta));
    } else if (isInserting) {
      context.missing(_methodMeta);
    }
    if (data.containsKey('body')) {
      context.handle(
          _bodyMeta, body.isAcceptableOrUnknown(data['body']!, _bodyMeta));
    } else if (isInserting) {
      context.missing(_bodyMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    }
    if (data.containsKey('retries')) {
      context.handle(_retriesMeta,
          retries.isAcceptableOrUnknown(data['retries']!, _retriesMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  OfflineQueueData map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return OfflineQueueData(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      endpoint: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}endpoint'])!,
      method: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}method'])!,
      body: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}body'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      retries: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}retries'])!,
    );
  }

  @override
  $OfflineQueueTable createAlias(String alias) {
    return $OfflineQueueTable(attachedDatabase, alias);
  }
}

class OfflineQueueData extends DataClass
    implements Insertable<OfflineQueueData> {
  final int id;
  final String endpoint;
  final String method;
  final String body;
  final DateTime createdAt;
  final int retries;
  const OfflineQueueData(
      {required this.id,
      required this.endpoint,
      required this.method,
      required this.body,
      required this.createdAt,
      required this.retries});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['endpoint'] = Variable<String>(endpoint);
    map['method'] = Variable<String>(method);
    map['body'] = Variable<String>(body);
    map['created_at'] = Variable<DateTime>(createdAt);
    map['retries'] = Variable<int>(retries);
    return map;
  }

  OfflineQueueCompanion toCompanion(bool nullToAbsent) {
    return OfflineQueueCompanion(
      id: Value(id),
      endpoint: Value(endpoint),
      method: Value(method),
      body: Value(body),
      createdAt: Value(createdAt),
      retries: Value(retries),
    );
  }

  factory OfflineQueueData.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return OfflineQueueData(
      id: serializer.fromJson<int>(json['id']),
      endpoint: serializer.fromJson<String>(json['endpoint']),
      method: serializer.fromJson<String>(json['method']),
      body: serializer.fromJson<String>(json['body']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      retries: serializer.fromJson<int>(json['retries']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'endpoint': serializer.toJson<String>(endpoint),
      'method': serializer.toJson<String>(method),
      'body': serializer.toJson<String>(body),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'retries': serializer.toJson<int>(retries),
    };
  }

  OfflineQueueData copyWith(
          {int? id,
          String? endpoint,
          String? method,
          String? body,
          DateTime? createdAt,
          int? retries}) =>
      OfflineQueueData(
        id: id ?? this.id,
        endpoint: endpoint ?? this.endpoint,
        method: method ?? this.method,
        body: body ?? this.body,
        createdAt: createdAt ?? this.createdAt,
        retries: retries ?? this.retries,
      );
  OfflineQueueData copyWithCompanion(OfflineQueueCompanion data) {
    return OfflineQueueData(
      id: data.id.present ? data.id.value : this.id,
      endpoint: data.endpoint.present ? data.endpoint.value : this.endpoint,
      method: data.method.present ? data.method.value : this.method,
      body: data.body.present ? data.body.value : this.body,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      retries: data.retries.present ? data.retries.value : this.retries,
    );
  }

  @override
  String toString() {
    return (StringBuffer('OfflineQueueData(')
          ..write('id: $id, ')
          ..write('endpoint: $endpoint, ')
          ..write('method: $method, ')
          ..write('body: $body, ')
          ..write('createdAt: $createdAt, ')
          ..write('retries: $retries')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, endpoint, method, body, createdAt, retries);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is OfflineQueueData &&
          other.id == this.id &&
          other.endpoint == this.endpoint &&
          other.method == this.method &&
          other.body == this.body &&
          other.createdAt == this.createdAt &&
          other.retries == this.retries);
}

class OfflineQueueCompanion extends UpdateCompanion<OfflineQueueData> {
  final Value<int> id;
  final Value<String> endpoint;
  final Value<String> method;
  final Value<String> body;
  final Value<DateTime> createdAt;
  final Value<int> retries;
  const OfflineQueueCompanion({
    this.id = const Value.absent(),
    this.endpoint = const Value.absent(),
    this.method = const Value.absent(),
    this.body = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.retries = const Value.absent(),
  });
  OfflineQueueCompanion.insert({
    this.id = const Value.absent(),
    required String endpoint,
    required String method,
    required String body,
    this.createdAt = const Value.absent(),
    this.retries = const Value.absent(),
  })  : endpoint = Value(endpoint),
        method = Value(method),
        body = Value(body);
  static Insertable<OfflineQueueData> custom({
    Expression<int>? id,
    Expression<String>? endpoint,
    Expression<String>? method,
    Expression<String>? body,
    Expression<DateTime>? createdAt,
    Expression<int>? retries,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (endpoint != null) 'endpoint': endpoint,
      if (method != null) 'method': method,
      if (body != null) 'body': body,
      if (createdAt != null) 'created_at': createdAt,
      if (retries != null) 'retries': retries,
    });
  }

  OfflineQueueCompanion copyWith(
      {Value<int>? id,
      Value<String>? endpoint,
      Value<String>? method,
      Value<String>? body,
      Value<DateTime>? createdAt,
      Value<int>? retries}) {
    return OfflineQueueCompanion(
      id: id ?? this.id,
      endpoint: endpoint ?? this.endpoint,
      method: method ?? this.method,
      body: body ?? this.body,
      createdAt: createdAt ?? this.createdAt,
      retries: retries ?? this.retries,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (endpoint.present) {
      map['endpoint'] = Variable<String>(endpoint.value);
    }
    if (method.present) {
      map['method'] = Variable<String>(method.value);
    }
    if (body.present) {
      map['body'] = Variable<String>(body.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (retries.present) {
      map['retries'] = Variable<int>(retries.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('OfflineQueueCompanion(')
          ..write('id: $id, ')
          ..write('endpoint: $endpoint, ')
          ..write('method: $method, ')
          ..write('body: $body, ')
          ..write('createdAt: $createdAt, ')
          ..write('retries: $retries')
          ..write(')'))
        .toString();
  }
}

class $CachedWorkoutSessionsTable extends CachedWorkoutSessions
    with TableInfo<$CachedWorkoutSessionsTable, CachedWorkoutSession> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedWorkoutSessionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
      'user_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _planIdMeta = const VerificationMeta('planId');
  @override
  late final GeneratedColumn<String> planId = GeneratedColumn<String>(
      'plan_id', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _startedAtMeta =
      const VerificationMeta('startedAt');
  @override
  late final GeneratedColumn<DateTime> startedAt = GeneratedColumn<DateTime>(
      'started_at', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _dataMeta = const VerificationMeta('data');
  @override
  late final GeneratedColumn<String> data = GeneratedColumn<String>(
      'data', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncedAtMeta =
      const VerificationMeta('syncedAt');
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
      'synced_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns =>
      [id, userId, planId, startedAt, data, syncedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_workout_sessions';
  @override
  VerificationContext validateIntegrity(
      Insertable<CachedWorkoutSession> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('plan_id')) {
      context.handle(_planIdMeta,
          planId.isAcceptableOrUnknown(data['plan_id']!, _planIdMeta));
    }
    if (data.containsKey('started_at')) {
      context.handle(_startedAtMeta,
          startedAt.isAcceptableOrUnknown(data['started_at']!, _startedAtMeta));
    }
    if (data.containsKey('data')) {
      context.handle(
          _dataMeta, this.data.isAcceptableOrUnknown(data['data']!, _dataMeta));
    } else if (isInserting) {
      context.missing(_dataMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(_syncedAtMeta,
          syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedWorkoutSession map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedWorkoutSession(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}user_id'])!,
      planId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}plan_id']),
      startedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}started_at']),
      data: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}data'])!,
      syncedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}synced_at'])!,
    );
  }

  @override
  $CachedWorkoutSessionsTable createAlias(String alias) {
    return $CachedWorkoutSessionsTable(attachedDatabase, alias);
  }
}

class CachedWorkoutSession extends DataClass
    implements Insertable<CachedWorkoutSession> {
  final String id;
  final String userId;
  final String? planId;
  final DateTime? startedAt;
  final String data;
  final DateTime syncedAt;
  const CachedWorkoutSession(
      {required this.id,
      required this.userId,
      this.planId,
      this.startedAt,
      required this.data,
      required this.syncedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    if (!nullToAbsent || planId != null) {
      map['plan_id'] = Variable<String>(planId);
    }
    if (!nullToAbsent || startedAt != null) {
      map['started_at'] = Variable<DateTime>(startedAt);
    }
    map['data'] = Variable<String>(data);
    map['synced_at'] = Variable<DateTime>(syncedAt);
    return map;
  }

  CachedWorkoutSessionsCompanion toCompanion(bool nullToAbsent) {
    return CachedWorkoutSessionsCompanion(
      id: Value(id),
      userId: Value(userId),
      planId:
          planId == null && nullToAbsent ? const Value.absent() : Value(planId),
      startedAt: startedAt == null && nullToAbsent
          ? const Value.absent()
          : Value(startedAt),
      data: Value(data),
      syncedAt: Value(syncedAt),
    );
  }

  factory CachedWorkoutSession.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedWorkoutSession(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      planId: serializer.fromJson<String?>(json['planId']),
      startedAt: serializer.fromJson<DateTime?>(json['startedAt']),
      data: serializer.fromJson<String>(json['data']),
      syncedAt: serializer.fromJson<DateTime>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'planId': serializer.toJson<String?>(planId),
      'startedAt': serializer.toJson<DateTime?>(startedAt),
      'data': serializer.toJson<String>(data),
      'syncedAt': serializer.toJson<DateTime>(syncedAt),
    };
  }

  CachedWorkoutSession copyWith(
          {String? id,
          String? userId,
          Value<String?> planId = const Value.absent(),
          Value<DateTime?> startedAt = const Value.absent(),
          String? data,
          DateTime? syncedAt}) =>
      CachedWorkoutSession(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        planId: planId.present ? planId.value : this.planId,
        startedAt: startedAt.present ? startedAt.value : this.startedAt,
        data: data ?? this.data,
        syncedAt: syncedAt ?? this.syncedAt,
      );
  CachedWorkoutSession copyWithCompanion(CachedWorkoutSessionsCompanion data) {
    return CachedWorkoutSession(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      planId: data.planId.present ? data.planId.value : this.planId,
      startedAt: data.startedAt.present ? data.startedAt.value : this.startedAt,
      data: data.data.present ? data.data.value : this.data,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedWorkoutSession(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('planId: $planId, ')
          ..write('startedAt: $startedAt, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, userId, planId, startedAt, data, syncedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedWorkoutSession &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.planId == this.planId &&
          other.startedAt == this.startedAt &&
          other.data == this.data &&
          other.syncedAt == this.syncedAt);
}

class CachedWorkoutSessionsCompanion
    extends UpdateCompanion<CachedWorkoutSession> {
  final Value<String> id;
  final Value<String> userId;
  final Value<String?> planId;
  final Value<DateTime?> startedAt;
  final Value<String> data;
  final Value<DateTime> syncedAt;
  final Value<int> rowid;
  const CachedWorkoutSessionsCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.planId = const Value.absent(),
    this.startedAt = const Value.absent(),
    this.data = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedWorkoutSessionsCompanion.insert({
    required String id,
    required String userId,
    this.planId = const Value.absent(),
    this.startedAt = const Value.absent(),
    required String data,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        userId = Value(userId),
        data = Value(data);
  static Insertable<CachedWorkoutSession> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<String>? planId,
    Expression<DateTime>? startedAt,
    Expression<String>? data,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (planId != null) 'plan_id': planId,
      if (startedAt != null) 'started_at': startedAt,
      if (data != null) 'data': data,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedWorkoutSessionsCompanion copyWith(
      {Value<String>? id,
      Value<String>? userId,
      Value<String?>? planId,
      Value<DateTime?>? startedAt,
      Value<String>? data,
      Value<DateTime>? syncedAt,
      Value<int>? rowid}) {
    return CachedWorkoutSessionsCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      planId: planId ?? this.planId,
      startedAt: startedAt ?? this.startedAt,
      data: data ?? this.data,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (planId.present) {
      map['plan_id'] = Variable<String>(planId.value);
    }
    if (startedAt.present) {
      map['started_at'] = Variable<DateTime>(startedAt.value);
    }
    if (data.present) {
      map['data'] = Variable<String>(data.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedWorkoutSessionsCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('planId: $planId, ')
          ..write('startedAt: $startedAt, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CachedDietPlansTable extends CachedDietPlans
    with TableInfo<$CachedDietPlansTable, CachedDietPlan> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedDietPlansTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
      'user_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dataMeta = const VerificationMeta('data');
  @override
  late final GeneratedColumn<String> data = GeneratedColumn<String>(
      'data', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncedAtMeta =
      const VerificationMeta('syncedAt');
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
      'synced_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [id, userId, data, syncedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_diet_plans';
  @override
  VerificationContext validateIntegrity(Insertable<CachedDietPlan> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('data')) {
      context.handle(
          _dataMeta, this.data.isAcceptableOrUnknown(data['data']!, _dataMeta));
    } else if (isInserting) {
      context.missing(_dataMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(_syncedAtMeta,
          syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedDietPlan map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedDietPlan(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}user_id'])!,
      data: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}data'])!,
      syncedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}synced_at'])!,
    );
  }

  @override
  $CachedDietPlansTable createAlias(String alias) {
    return $CachedDietPlansTable(attachedDatabase, alias);
  }
}

class CachedDietPlan extends DataClass implements Insertable<CachedDietPlan> {
  final String id;
  final String userId;
  final String data;
  final DateTime syncedAt;
  const CachedDietPlan(
      {required this.id,
      required this.userId,
      required this.data,
      required this.syncedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['data'] = Variable<String>(data);
    map['synced_at'] = Variable<DateTime>(syncedAt);
    return map;
  }

  CachedDietPlansCompanion toCompanion(bool nullToAbsent) {
    return CachedDietPlansCompanion(
      id: Value(id),
      userId: Value(userId),
      data: Value(data),
      syncedAt: Value(syncedAt),
    );
  }

  factory CachedDietPlan.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedDietPlan(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      data: serializer.fromJson<String>(json['data']),
      syncedAt: serializer.fromJson<DateTime>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'data': serializer.toJson<String>(data),
      'syncedAt': serializer.toJson<DateTime>(syncedAt),
    };
  }

  CachedDietPlan copyWith(
          {String? id, String? userId, String? data, DateTime? syncedAt}) =>
      CachedDietPlan(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        data: data ?? this.data,
        syncedAt: syncedAt ?? this.syncedAt,
      );
  CachedDietPlan copyWithCompanion(CachedDietPlansCompanion data) {
    return CachedDietPlan(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      data: data.data.present ? data.data.value : this.data,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedDietPlan(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, userId, data, syncedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedDietPlan &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.data == this.data &&
          other.syncedAt == this.syncedAt);
}

class CachedDietPlansCompanion extends UpdateCompanion<CachedDietPlan> {
  final Value<String> id;
  final Value<String> userId;
  final Value<String> data;
  final Value<DateTime> syncedAt;
  final Value<int> rowid;
  const CachedDietPlansCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.data = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedDietPlansCompanion.insert({
    required String id,
    required String userId,
    required String data,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        userId = Value(userId),
        data = Value(data);
  static Insertable<CachedDietPlan> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<String>? data,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (data != null) 'data': data,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedDietPlansCompanion copyWith(
      {Value<String>? id,
      Value<String>? userId,
      Value<String>? data,
      Value<DateTime>? syncedAt,
      Value<int>? rowid}) {
    return CachedDietPlansCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      data: data ?? this.data,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (data.present) {
      map['data'] = Variable<String>(data.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedDietPlansCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

class $CachedSupplementPlansTable extends CachedSupplementPlans
    with TableInfo<$CachedSupplementPlansTable, CachedSupplementPlan> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $CachedSupplementPlansTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<String> id = GeneratedColumn<String>(
      'id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _userIdMeta = const VerificationMeta('userId');
  @override
  late final GeneratedColumn<String> userId = GeneratedColumn<String>(
      'user_id', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _dataMeta = const VerificationMeta('data');
  @override
  late final GeneratedColumn<String> data = GeneratedColumn<String>(
      'data', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _syncedAtMeta =
      const VerificationMeta('syncedAt');
  @override
  late final GeneratedColumn<DateTime> syncedAt = GeneratedColumn<DateTime>(
      'synced_at', aliasedName, false,
      type: DriftSqlType.dateTime,
      requiredDuringInsert: false,
      defaultValue: currentDateAndTime);
  @override
  List<GeneratedColumn> get $columns => [id, userId, data, syncedAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'cached_supplement_plans';
  @override
  VerificationContext validateIntegrity(
      Insertable<CachedSupplementPlan> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    } else if (isInserting) {
      context.missing(_idMeta);
    }
    if (data.containsKey('user_id')) {
      context.handle(_userIdMeta,
          userId.isAcceptableOrUnknown(data['user_id']!, _userIdMeta));
    } else if (isInserting) {
      context.missing(_userIdMeta);
    }
    if (data.containsKey('data')) {
      context.handle(
          _dataMeta, this.data.isAcceptableOrUnknown(data['data']!, _dataMeta));
    } else if (isInserting) {
      context.missing(_dataMeta);
    }
    if (data.containsKey('synced_at')) {
      context.handle(_syncedAtMeta,
          syncedAt.isAcceptableOrUnknown(data['synced_at']!, _syncedAtMeta));
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  CachedSupplementPlan map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return CachedSupplementPlan(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}id'])!,
      userId: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}user_id'])!,
      data: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}data'])!,
      syncedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}synced_at'])!,
    );
  }

  @override
  $CachedSupplementPlansTable createAlias(String alias) {
    return $CachedSupplementPlansTable(attachedDatabase, alias);
  }
}

class CachedSupplementPlan extends DataClass
    implements Insertable<CachedSupplementPlan> {
  final String id;
  final String userId;
  final String data;
  final DateTime syncedAt;
  const CachedSupplementPlan(
      {required this.id,
      required this.userId,
      required this.data,
      required this.syncedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<String>(id);
    map['user_id'] = Variable<String>(userId);
    map['data'] = Variable<String>(data);
    map['synced_at'] = Variable<DateTime>(syncedAt);
    return map;
  }

  CachedSupplementPlansCompanion toCompanion(bool nullToAbsent) {
    return CachedSupplementPlansCompanion(
      id: Value(id),
      userId: Value(userId),
      data: Value(data),
      syncedAt: Value(syncedAt),
    );
  }

  factory CachedSupplementPlan.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return CachedSupplementPlan(
      id: serializer.fromJson<String>(json['id']),
      userId: serializer.fromJson<String>(json['userId']),
      data: serializer.fromJson<String>(json['data']),
      syncedAt: serializer.fromJson<DateTime>(json['syncedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<String>(id),
      'userId': serializer.toJson<String>(userId),
      'data': serializer.toJson<String>(data),
      'syncedAt': serializer.toJson<DateTime>(syncedAt),
    };
  }

  CachedSupplementPlan copyWith(
          {String? id, String? userId, String? data, DateTime? syncedAt}) =>
      CachedSupplementPlan(
        id: id ?? this.id,
        userId: userId ?? this.userId,
        data: data ?? this.data,
        syncedAt: syncedAt ?? this.syncedAt,
      );
  CachedSupplementPlan copyWithCompanion(CachedSupplementPlansCompanion data) {
    return CachedSupplementPlan(
      id: data.id.present ? data.id.value : this.id,
      userId: data.userId.present ? data.userId.value : this.userId,
      data: data.data.present ? data.data.value : this.data,
      syncedAt: data.syncedAt.present ? data.syncedAt.value : this.syncedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('CachedSupplementPlan(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, userId, data, syncedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is CachedSupplementPlan &&
          other.id == this.id &&
          other.userId == this.userId &&
          other.data == this.data &&
          other.syncedAt == this.syncedAt);
}

class CachedSupplementPlansCompanion
    extends UpdateCompanion<CachedSupplementPlan> {
  final Value<String> id;
  final Value<String> userId;
  final Value<String> data;
  final Value<DateTime> syncedAt;
  final Value<int> rowid;
  const CachedSupplementPlansCompanion({
    this.id = const Value.absent(),
    this.userId = const Value.absent(),
    this.data = const Value.absent(),
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  });
  CachedSupplementPlansCompanion.insert({
    required String id,
    required String userId,
    required String data,
    this.syncedAt = const Value.absent(),
    this.rowid = const Value.absent(),
  })  : id = Value(id),
        userId = Value(userId),
        data = Value(data);
  static Insertable<CachedSupplementPlan> custom({
    Expression<String>? id,
    Expression<String>? userId,
    Expression<String>? data,
    Expression<DateTime>? syncedAt,
    Expression<int>? rowid,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (userId != null) 'user_id': userId,
      if (data != null) 'data': data,
      if (syncedAt != null) 'synced_at': syncedAt,
      if (rowid != null) 'rowid': rowid,
    });
  }

  CachedSupplementPlansCompanion copyWith(
      {Value<String>? id,
      Value<String>? userId,
      Value<String>? data,
      Value<DateTime>? syncedAt,
      Value<int>? rowid}) {
    return CachedSupplementPlansCompanion(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      data: data ?? this.data,
      syncedAt: syncedAt ?? this.syncedAt,
      rowid: rowid ?? this.rowid,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<String>(id.value);
    }
    if (userId.present) {
      map['user_id'] = Variable<String>(userId.value);
    }
    if (data.present) {
      map['data'] = Variable<String>(data.value);
    }
    if (syncedAt.present) {
      map['synced_at'] = Variable<DateTime>(syncedAt.value);
    }
    if (rowid.present) {
      map['rowid'] = Variable<int>(rowid.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('CachedSupplementPlansCompanion(')
          ..write('id: $id, ')
          ..write('userId: $userId, ')
          ..write('data: $data, ')
          ..write('syncedAt: $syncedAt, ')
          ..write('rowid: $rowid')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $CachedScheduleItemsTable cachedScheduleItems =
      $CachedScheduleItemsTable(this);
  late final $OfflineQueueTable offlineQueue = $OfflineQueueTable(this);
  late final $CachedWorkoutSessionsTable cachedWorkoutSessions =
      $CachedWorkoutSessionsTable(this);
  late final $CachedDietPlansTable cachedDietPlans =
      $CachedDietPlansTable(this);
  late final $CachedSupplementPlansTable cachedSupplementPlans =
      $CachedSupplementPlansTable(this);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [
        cachedScheduleItems,
        offlineQueue,
        cachedWorkoutSessions,
        cachedDietPlans,
        cachedSupplementPlans
      ];
}

typedef $$CachedScheduleItemsTableCreateCompanionBuilder
    = CachedScheduleItemsCompanion Function({
  required String id,
  required String userId,
  required String date,
  required String itemType,
  required String title,
  Value<String?> subtitle,
  required DateTime scheduledTime,
  required String status,
  Value<String?> referenceId,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});
typedef $$CachedScheduleItemsTableUpdateCompanionBuilder
    = CachedScheduleItemsCompanion Function({
  Value<String> id,
  Value<String> userId,
  Value<String> date,
  Value<String> itemType,
  Value<String> title,
  Value<String?> subtitle,
  Value<DateTime> scheduledTime,
  Value<String> status,
  Value<String?> referenceId,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});

class $$CachedScheduleItemsTableFilterComposer
    extends Composer<_$AppDatabase, $CachedScheduleItemsTable> {
  $$CachedScheduleItemsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get itemType => $composableBuilder(
      column: $table.itemType, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get title => $composableBuilder(
      column: $table.title, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get subtitle => $composableBuilder(
      column: $table.subtitle, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get scheduledTime => $composableBuilder(
      column: $table.scheduledTime, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get referenceId => $composableBuilder(
      column: $table.referenceId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnFilters(column));
}

class $$CachedScheduleItemsTableOrderingComposer
    extends Composer<_$AppDatabase, $CachedScheduleItemsTable> {
  $$CachedScheduleItemsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get date => $composableBuilder(
      column: $table.date, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get itemType => $composableBuilder(
      column: $table.itemType, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get title => $composableBuilder(
      column: $table.title, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get subtitle => $composableBuilder(
      column: $table.subtitle, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get scheduledTime => $composableBuilder(
      column: $table.scheduledTime,
      builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get status => $composableBuilder(
      column: $table.status, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get referenceId => $composableBuilder(
      column: $table.referenceId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnOrderings(column));
}

class $$CachedScheduleItemsTableAnnotationComposer
    extends Composer<_$AppDatabase, $CachedScheduleItemsTable> {
  $$CachedScheduleItemsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<String> get date =>
      $composableBuilder(column: $table.date, builder: (column) => column);

  GeneratedColumn<String> get itemType =>
      $composableBuilder(column: $table.itemType, builder: (column) => column);

  GeneratedColumn<String> get title =>
      $composableBuilder(column: $table.title, builder: (column) => column);

  GeneratedColumn<String> get subtitle =>
      $composableBuilder(column: $table.subtitle, builder: (column) => column);

  GeneratedColumn<DateTime> get scheduledTime => $composableBuilder(
      column: $table.scheduledTime, builder: (column) => column);

  GeneratedColumn<String> get status =>
      $composableBuilder(column: $table.status, builder: (column) => column);

  GeneratedColumn<String> get referenceId => $composableBuilder(
      column: $table.referenceId, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$CachedScheduleItemsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedScheduleItemsTable,
    CachedScheduleItem,
    $$CachedScheduleItemsTableFilterComposer,
    $$CachedScheduleItemsTableOrderingComposer,
    $$CachedScheduleItemsTableAnnotationComposer,
    $$CachedScheduleItemsTableCreateCompanionBuilder,
    $$CachedScheduleItemsTableUpdateCompanionBuilder,
    (
      CachedScheduleItem,
      BaseReferences<_$AppDatabase, $CachedScheduleItemsTable,
          CachedScheduleItem>
    ),
    CachedScheduleItem,
    PrefetchHooks Function()> {
  $$CachedScheduleItemsTableTableManager(
      _$AppDatabase db, $CachedScheduleItemsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CachedScheduleItemsTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CachedScheduleItemsTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CachedScheduleItemsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> userId = const Value.absent(),
            Value<String> date = const Value.absent(),
            Value<String> itemType = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<String?> subtitle = const Value.absent(),
            Value<DateTime> scheduledTime = const Value.absent(),
            Value<String> status = const Value.absent(),
            Value<String?> referenceId = const Value.absent(),
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedScheduleItemsCompanion(
            id: id,
            userId: userId,
            date: date,
            itemType: itemType,
            title: title,
            subtitle: subtitle,
            scheduledTime: scheduledTime,
            status: status,
            referenceId: referenceId,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String userId,
            required String date,
            required String itemType,
            required String title,
            Value<String?> subtitle = const Value.absent(),
            required DateTime scheduledTime,
            required String status,
            Value<String?> referenceId = const Value.absent(),
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedScheduleItemsCompanion.insert(
            id: id,
            userId: userId,
            date: date,
            itemType: itemType,
            title: title,
            subtitle: subtitle,
            scheduledTime: scheduledTime,
            status: status,
            referenceId: referenceId,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CachedScheduleItemsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CachedScheduleItemsTable,
    CachedScheduleItem,
    $$CachedScheduleItemsTableFilterComposer,
    $$CachedScheduleItemsTableOrderingComposer,
    $$CachedScheduleItemsTableAnnotationComposer,
    $$CachedScheduleItemsTableCreateCompanionBuilder,
    $$CachedScheduleItemsTableUpdateCompanionBuilder,
    (
      CachedScheduleItem,
      BaseReferences<_$AppDatabase, $CachedScheduleItemsTable,
          CachedScheduleItem>
    ),
    CachedScheduleItem,
    PrefetchHooks Function()>;
typedef $$OfflineQueueTableCreateCompanionBuilder = OfflineQueueCompanion
    Function({
  Value<int> id,
  required String endpoint,
  required String method,
  required String body,
  Value<DateTime> createdAt,
  Value<int> retries,
});
typedef $$OfflineQueueTableUpdateCompanionBuilder = OfflineQueueCompanion
    Function({
  Value<int> id,
  Value<String> endpoint,
  Value<String> method,
  Value<String> body,
  Value<DateTime> createdAt,
  Value<int> retries,
});

class $$OfflineQueueTableFilterComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get endpoint => $composableBuilder(
      column: $table.endpoint, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get method => $composableBuilder(
      column: $table.method, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get body => $composableBuilder(
      column: $table.body, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<int> get retries => $composableBuilder(
      column: $table.retries, builder: (column) => ColumnFilters(column));
}

class $$OfflineQueueTableOrderingComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<int> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get endpoint => $composableBuilder(
      column: $table.endpoint, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get method => $composableBuilder(
      column: $table.method, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get body => $composableBuilder(
      column: $table.body, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get createdAt => $composableBuilder(
      column: $table.createdAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<int> get retries => $composableBuilder(
      column: $table.retries, builder: (column) => ColumnOrderings(column));
}

class $$OfflineQueueTableAnnotationComposer
    extends Composer<_$AppDatabase, $OfflineQueueTable> {
  $$OfflineQueueTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<int> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get endpoint =>
      $composableBuilder(column: $table.endpoint, builder: (column) => column);

  GeneratedColumn<String> get method =>
      $composableBuilder(column: $table.method, builder: (column) => column);

  GeneratedColumn<String> get body =>
      $composableBuilder(column: $table.body, builder: (column) => column);

  GeneratedColumn<DateTime> get createdAt =>
      $composableBuilder(column: $table.createdAt, builder: (column) => column);

  GeneratedColumn<int> get retries =>
      $composableBuilder(column: $table.retries, builder: (column) => column);
}

class $$OfflineQueueTableTableManager extends RootTableManager<
    _$AppDatabase,
    $OfflineQueueTable,
    OfflineQueueData,
    $$OfflineQueueTableFilterComposer,
    $$OfflineQueueTableOrderingComposer,
    $$OfflineQueueTableAnnotationComposer,
    $$OfflineQueueTableCreateCompanionBuilder,
    $$OfflineQueueTableUpdateCompanionBuilder,
    (
      OfflineQueueData,
      BaseReferences<_$AppDatabase, $OfflineQueueTable, OfflineQueueData>
    ),
    OfflineQueueData,
    PrefetchHooks Function()> {
  $$OfflineQueueTableTableManager(_$AppDatabase db, $OfflineQueueTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$OfflineQueueTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$OfflineQueueTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$OfflineQueueTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> endpoint = const Value.absent(),
            Value<String> method = const Value.absent(),
            Value<String> body = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> retries = const Value.absent(),
          }) =>
              OfflineQueueCompanion(
            id: id,
            endpoint: endpoint,
            method: method,
            body: body,
            createdAt: createdAt,
            retries: retries,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String endpoint,
            required String method,
            required String body,
            Value<DateTime> createdAt = const Value.absent(),
            Value<int> retries = const Value.absent(),
          }) =>
              OfflineQueueCompanion.insert(
            id: id,
            endpoint: endpoint,
            method: method,
            body: body,
            createdAt: createdAt,
            retries: retries,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$OfflineQueueTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $OfflineQueueTable,
    OfflineQueueData,
    $$OfflineQueueTableFilterComposer,
    $$OfflineQueueTableOrderingComposer,
    $$OfflineQueueTableAnnotationComposer,
    $$OfflineQueueTableCreateCompanionBuilder,
    $$OfflineQueueTableUpdateCompanionBuilder,
    (
      OfflineQueueData,
      BaseReferences<_$AppDatabase, $OfflineQueueTable, OfflineQueueData>
    ),
    OfflineQueueData,
    PrefetchHooks Function()>;
typedef $$CachedWorkoutSessionsTableCreateCompanionBuilder
    = CachedWorkoutSessionsCompanion Function({
  required String id,
  required String userId,
  Value<String?> planId,
  Value<DateTime?> startedAt,
  required String data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});
typedef $$CachedWorkoutSessionsTableUpdateCompanionBuilder
    = CachedWorkoutSessionsCompanion Function({
  Value<String> id,
  Value<String> userId,
  Value<String?> planId,
  Value<DateTime?> startedAt,
  Value<String> data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});

class $$CachedWorkoutSessionsTableFilterComposer
    extends Composer<_$AppDatabase, $CachedWorkoutSessionsTable> {
  $$CachedWorkoutSessionsTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get planId => $composableBuilder(
      column: $table.planId, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get startedAt => $composableBuilder(
      column: $table.startedAt, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnFilters(column));
}

class $$CachedWorkoutSessionsTableOrderingComposer
    extends Composer<_$AppDatabase, $CachedWorkoutSessionsTable> {
  $$CachedWorkoutSessionsTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get planId => $composableBuilder(
      column: $table.planId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get startedAt => $composableBuilder(
      column: $table.startedAt, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnOrderings(column));
}

class $$CachedWorkoutSessionsTableAnnotationComposer
    extends Composer<_$AppDatabase, $CachedWorkoutSessionsTable> {
  $$CachedWorkoutSessionsTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<String> get planId =>
      $composableBuilder(column: $table.planId, builder: (column) => column);

  GeneratedColumn<DateTime> get startedAt =>
      $composableBuilder(column: $table.startedAt, builder: (column) => column);

  GeneratedColumn<String> get data =>
      $composableBuilder(column: $table.data, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$CachedWorkoutSessionsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedWorkoutSessionsTable,
    CachedWorkoutSession,
    $$CachedWorkoutSessionsTableFilterComposer,
    $$CachedWorkoutSessionsTableOrderingComposer,
    $$CachedWorkoutSessionsTableAnnotationComposer,
    $$CachedWorkoutSessionsTableCreateCompanionBuilder,
    $$CachedWorkoutSessionsTableUpdateCompanionBuilder,
    (
      CachedWorkoutSession,
      BaseReferences<_$AppDatabase, $CachedWorkoutSessionsTable,
          CachedWorkoutSession>
    ),
    CachedWorkoutSession,
    PrefetchHooks Function()> {
  $$CachedWorkoutSessionsTableTableManager(
      _$AppDatabase db, $CachedWorkoutSessionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CachedWorkoutSessionsTableFilterComposer(
                  $db: db, $table: table),
          createOrderingComposer: () =>
              $$CachedWorkoutSessionsTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CachedWorkoutSessionsTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> userId = const Value.absent(),
            Value<String?> planId = const Value.absent(),
            Value<DateTime?> startedAt = const Value.absent(),
            Value<String> data = const Value.absent(),
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedWorkoutSessionsCompanion(
            id: id,
            userId: userId,
            planId: planId,
            startedAt: startedAt,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String userId,
            Value<String?> planId = const Value.absent(),
            Value<DateTime?> startedAt = const Value.absent(),
            required String data,
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedWorkoutSessionsCompanion.insert(
            id: id,
            userId: userId,
            planId: planId,
            startedAt: startedAt,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CachedWorkoutSessionsTableProcessedTableManager
    = ProcessedTableManager<
        _$AppDatabase,
        $CachedWorkoutSessionsTable,
        CachedWorkoutSession,
        $$CachedWorkoutSessionsTableFilterComposer,
        $$CachedWorkoutSessionsTableOrderingComposer,
        $$CachedWorkoutSessionsTableAnnotationComposer,
        $$CachedWorkoutSessionsTableCreateCompanionBuilder,
        $$CachedWorkoutSessionsTableUpdateCompanionBuilder,
        (
          CachedWorkoutSession,
          BaseReferences<_$AppDatabase, $CachedWorkoutSessionsTable,
              CachedWorkoutSession>
        ),
        CachedWorkoutSession,
        PrefetchHooks Function()>;
typedef $$CachedDietPlansTableCreateCompanionBuilder = CachedDietPlansCompanion
    Function({
  required String id,
  required String userId,
  required String data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});
typedef $$CachedDietPlansTableUpdateCompanionBuilder = CachedDietPlansCompanion
    Function({
  Value<String> id,
  Value<String> userId,
  Value<String> data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});

class $$CachedDietPlansTableFilterComposer
    extends Composer<_$AppDatabase, $CachedDietPlansTable> {
  $$CachedDietPlansTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnFilters(column));
}

class $$CachedDietPlansTableOrderingComposer
    extends Composer<_$AppDatabase, $CachedDietPlansTable> {
  $$CachedDietPlansTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnOrderings(column));
}

class $$CachedDietPlansTableAnnotationComposer
    extends Composer<_$AppDatabase, $CachedDietPlansTable> {
  $$CachedDietPlansTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<String> get data =>
      $composableBuilder(column: $table.data, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$CachedDietPlansTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedDietPlansTable,
    CachedDietPlan,
    $$CachedDietPlansTableFilterComposer,
    $$CachedDietPlansTableOrderingComposer,
    $$CachedDietPlansTableAnnotationComposer,
    $$CachedDietPlansTableCreateCompanionBuilder,
    $$CachedDietPlansTableUpdateCompanionBuilder,
    (
      CachedDietPlan,
      BaseReferences<_$AppDatabase, $CachedDietPlansTable, CachedDietPlan>
    ),
    CachedDietPlan,
    PrefetchHooks Function()> {
  $$CachedDietPlansTableTableManager(
      _$AppDatabase db, $CachedDietPlansTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CachedDietPlansTableFilterComposer($db: db, $table: table),
          createOrderingComposer: () =>
              $$CachedDietPlansTableOrderingComposer($db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CachedDietPlansTableAnnotationComposer($db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> userId = const Value.absent(),
            Value<String> data = const Value.absent(),
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedDietPlansCompanion(
            id: id,
            userId: userId,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String userId,
            required String data,
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedDietPlansCompanion.insert(
            id: id,
            userId: userId,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CachedDietPlansTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $CachedDietPlansTable,
    CachedDietPlan,
    $$CachedDietPlansTableFilterComposer,
    $$CachedDietPlansTableOrderingComposer,
    $$CachedDietPlansTableAnnotationComposer,
    $$CachedDietPlansTableCreateCompanionBuilder,
    $$CachedDietPlansTableUpdateCompanionBuilder,
    (
      CachedDietPlan,
      BaseReferences<_$AppDatabase, $CachedDietPlansTable, CachedDietPlan>
    ),
    CachedDietPlan,
    PrefetchHooks Function()>;
typedef $$CachedSupplementPlansTableCreateCompanionBuilder
    = CachedSupplementPlansCompanion Function({
  required String id,
  required String userId,
  required String data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});
typedef $$CachedSupplementPlansTableUpdateCompanionBuilder
    = CachedSupplementPlansCompanion Function({
  Value<String> id,
  Value<String> userId,
  Value<String> data,
  Value<DateTime> syncedAt,
  Value<int> rowid,
});

class $$CachedSupplementPlansTableFilterComposer
    extends Composer<_$AppDatabase, $CachedSupplementPlansTable> {
  $$CachedSupplementPlansTableFilterComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnFilters<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnFilters(column));

  ColumnFilters<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnFilters(column));

  ColumnFilters<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnFilters(column));
}

class $$CachedSupplementPlansTableOrderingComposer
    extends Composer<_$AppDatabase, $CachedSupplementPlansTable> {
  $$CachedSupplementPlansTableOrderingComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  ColumnOrderings<String> get id => $composableBuilder(
      column: $table.id, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get userId => $composableBuilder(
      column: $table.userId, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<String> get data => $composableBuilder(
      column: $table.data, builder: (column) => ColumnOrderings(column));

  ColumnOrderings<DateTime> get syncedAt => $composableBuilder(
      column: $table.syncedAt, builder: (column) => ColumnOrderings(column));
}

class $$CachedSupplementPlansTableAnnotationComposer
    extends Composer<_$AppDatabase, $CachedSupplementPlansTable> {
  $$CachedSupplementPlansTableAnnotationComposer({
    required super.$db,
    required super.$table,
    super.joinBuilder,
    super.$addJoinBuilderToRootComposer,
    super.$removeJoinBuilderFromRootComposer,
  });
  GeneratedColumn<String> get id =>
      $composableBuilder(column: $table.id, builder: (column) => column);

  GeneratedColumn<String> get userId =>
      $composableBuilder(column: $table.userId, builder: (column) => column);

  GeneratedColumn<String> get data =>
      $composableBuilder(column: $table.data, builder: (column) => column);

  GeneratedColumn<DateTime> get syncedAt =>
      $composableBuilder(column: $table.syncedAt, builder: (column) => column);
}

class $$CachedSupplementPlansTableTableManager extends RootTableManager<
    _$AppDatabase,
    $CachedSupplementPlansTable,
    CachedSupplementPlan,
    $$CachedSupplementPlansTableFilterComposer,
    $$CachedSupplementPlansTableOrderingComposer,
    $$CachedSupplementPlansTableAnnotationComposer,
    $$CachedSupplementPlansTableCreateCompanionBuilder,
    $$CachedSupplementPlansTableUpdateCompanionBuilder,
    (
      CachedSupplementPlan,
      BaseReferences<_$AppDatabase, $CachedSupplementPlansTable,
          CachedSupplementPlan>
    ),
    CachedSupplementPlan,
    PrefetchHooks Function()> {
  $$CachedSupplementPlansTableTableManager(
      _$AppDatabase db, $CachedSupplementPlansTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          createFilteringComposer: () =>
              $$CachedSupplementPlansTableFilterComposer(
                  $db: db, $table: table),
          createOrderingComposer: () =>
              $$CachedSupplementPlansTableOrderingComposer(
                  $db: db, $table: table),
          createComputedFieldComposer: () =>
              $$CachedSupplementPlansTableAnnotationComposer(
                  $db: db, $table: table),
          updateCompanionCallback: ({
            Value<String> id = const Value.absent(),
            Value<String> userId = const Value.absent(),
            Value<String> data = const Value.absent(),
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedSupplementPlansCompanion(
            id: id,
            userId: userId,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          createCompanionCallback: ({
            required String id,
            required String userId,
            required String data,
            Value<DateTime> syncedAt = const Value.absent(),
            Value<int> rowid = const Value.absent(),
          }) =>
              CachedSupplementPlansCompanion.insert(
            id: id,
            userId: userId,
            data: data,
            syncedAt: syncedAt,
            rowid: rowid,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$CachedSupplementPlansTableProcessedTableManager
    = ProcessedTableManager<
        _$AppDatabase,
        $CachedSupplementPlansTable,
        CachedSupplementPlan,
        $$CachedSupplementPlansTableFilterComposer,
        $$CachedSupplementPlansTableOrderingComposer,
        $$CachedSupplementPlansTableAnnotationComposer,
        $$CachedSupplementPlansTableCreateCompanionBuilder,
        $$CachedSupplementPlansTableUpdateCompanionBuilder,
        (
          CachedSupplementPlan,
          BaseReferences<_$AppDatabase, $CachedSupplementPlansTable,
              CachedSupplementPlan>
        ),
        CachedSupplementPlan,
        PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$CachedScheduleItemsTableTableManager get cachedScheduleItems =>
      $$CachedScheduleItemsTableTableManager(_db, _db.cachedScheduleItems);
  $$OfflineQueueTableTableManager get offlineQueue =>
      $$OfflineQueueTableTableManager(_db, _db.offlineQueue);
  $$CachedWorkoutSessionsTableTableManager get cachedWorkoutSessions =>
      $$CachedWorkoutSessionsTableTableManager(_db, _db.cachedWorkoutSessions);
  $$CachedDietPlansTableTableManager get cachedDietPlans =>
      $$CachedDietPlansTableTableManager(_db, _db.cachedDietPlans);
  $$CachedSupplementPlansTableTableManager get cachedSupplementPlans =>
      $$CachedSupplementPlansTableTableManager(_db, _db.cachedSupplementPlans);
}
