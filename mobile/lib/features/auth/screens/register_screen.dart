import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/themed_colors.dart';
import '../bloc/auth_bloc.dart';
import '../bloc/auth_event.dart';
import '../bloc/auth_state.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _form = GlobalKey<FormState>();
  final _name = TextEditingController();
  final _email = TextEditingController();
  final _pass = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          final c = ThemedColors.of(context);
          final busy = state.status == AuthStatus.loading;
          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _form,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Brand
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        gradient: AppColors.avatarGradient,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(Icons.bolt, size: 36, color: c.fg),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'Create account',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        color: c.fg,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Start your fitness journey',
                      style: TextStyle(color: c.muted, fontSize: 15),
                    ),
                    const SizedBox(height: 40),

                    // Form card
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: c.glassBg,
                        borderRadius: BorderRadius.circular(AppColors.radiusMd),
                        border: Border.all(color: c.border),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'FULL NAME',
                            style: TextStyle(
                              color: c.muted,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _name,
                            decoration:
                                const InputDecoration(hintText: 'John Doe'),
                            validator: (v) =>
                                v == null || v.isEmpty ? 'Required' : null,
                          ),
                          const SizedBox(height: 20),
                          Text(
                            'EMAIL',
                            style: TextStyle(
                              color: c.muted,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _email,
                            decoration: const InputDecoration(
                                hintText: 'you@example.com'),
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) => v != null && v.contains('@')
                                ? null
                                : 'Enter an email',
                          ),
                          const SizedBox(height: 20),
                          Text(
                            'PASSWORD',
                            style: TextStyle(
                              color: c.muted,
                              fontSize: 11,
                              fontWeight: FontWeight.w500,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          TextFormField(
                            controller: _pass,
                            decoration: const InputDecoration(
                              hintText: 'Min 8 characters',
                            ),
                            obscureText: true,
                            validator: (v) => v != null && v.length >= 8
                                ? null
                                : 'Min 8 characters',
                          ),
                          if (state.status == AuthStatus.error &&
                              state.error != null) ...[
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppColors.badgeRedBg,
                                borderRadius:
                                    BorderRadius.circular(AppColors.radiusSm),
                                border: Border.all(
                                    color: AppColors.danger.withAlpha(80)),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.error_outline,
                                      size: 18, color: AppColors.dangerMuted),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      state.error!,
                                      style: const TextStyle(
                                        color: AppColors.dangerMuted,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          const SizedBox(height: 24),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton(
                              onPressed: busy
                                  ? null
                                  : () {
                                      if (_form.currentState!.validate()) {
                                        context.read<AuthBloc>().add(
                                              AuthRegisterRequested(
                                                email: _email.text.trim(),
                                                password: _pass.text,
                                                fullName: _name.text.trim(),
                                              ),
                                            );
                                      }
                                    },
                              child: busy
                                  ? SizedBox(
                                      height: 16,
                                      width: 16,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        color: c.fg,
                                      ),
                                    )
                                  : const Text('Create account'),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextButton(
                      onPressed: () => context.go('/login'),
                      child: const Text('I already have an account'),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
