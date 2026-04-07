# NutriTrack Mobile (Flutter)

Cross-platform iOS/Android client.

## Architecture

```
lib/
├── main.dart                # entry point + DI bootstrap
├── app.dart                 # MaterialApp.router
├── core/
│   ├── api/                 # Dio client + interceptors
│   ├── auth/                # token storage
│   ├── di/                  # get_it setup
│   └── theme/               # M3 colour scheme + typography
├── features/                # feature-first folders (BLoC pattern)
│   ├── auth/
│   ├── timeline/            # ★ daily schedule view
│   ├── analytics/           # adherence rings, charts
│   ├── tracking/            # water, body, notes
│   ├── diet_plan/
│   ├── supplements/
│   └── settings/
├── models/                  # shared domain models
└── navigation/              # go_router + bottom-nav shell
```

## Run

```bash
flutter pub get
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:3000/api
```

The default base URL points at the Android emulator's `localhost`. For iOS
simulator, use `http://localhost:3000/api`.

## Status

Phase 1 scaffolding only — screens currently render placeholder content.
TimelineBloc and live API integration are next.
