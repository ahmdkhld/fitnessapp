import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
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
      appBar: AppBar(title: const Text('Create account')),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          final busy = state.status == AuthStatus.loading;
          return Form(
            key: _form,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextFormField(
                    controller: _name,
                    decoration: const InputDecoration(labelText: 'Full name'),
                    validator: (v) =>
                        v == null || v.isEmpty ? 'Required' : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _email,
                    decoration: const InputDecoration(labelText: 'Email'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (v) =>
                        v != null && v.contains('@') ? null : 'Enter an email',
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _pass,
                    decoration: const InputDecoration(labelText: 'Password'),
                    obscureText: true,
                    validator: (v) =>
                        v != null && v.length >= 8 ? null : 'Min 8 characters',
                  ),
                  if (state.status == AuthStatus.error && state.error != null) ...[
                    const SizedBox(height: 12),
                    Text(
                      state.error!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  ],
                  const SizedBox(height: 24),
                  FilledButton(
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
                        ? const SizedBox(
                            height: 16,
                            width: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Create account'),
                  ),
                  TextButton(
                    onPressed: () => context.go('/login'),
                    child: const Text('I already have an account'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
