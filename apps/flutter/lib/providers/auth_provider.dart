import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';

import '../models/user_model.dart';
import '../services/auth_service.dart';

// ── AuthStatus ─────────────────────────────────────────────────────────────

enum AuthStatus {
  /// Initial state before the auth state is known.
  loading,

  /// No authenticated user.
  unauthenticated,

  /// Authenticated but the user has not completed onboarding.
  onboarding,

  /// Fully authenticated with a complete profile.
  authenticated,
}

// ── AuthProvider ───────────────────────────────────────────────────────────

/// Exposes authentication state and operations to the widget tree.
///
/// Listens to [AuthService.userStream] and maps it to an [AuthStatus] that
/// drives the app router. All UI interactions go through this provider so
/// that loading / error states are handled consistently.
class AuthProvider extends ChangeNotifier {
  AuthProvider({AuthService? service})
      : _service = service ?? AuthService() {
    _init();
  }

  final AuthService _service;

  AuthStatus _status = AuthStatus.loading;
  UserModel? _user;
  String? _error;
  OnboardingStep _onboardingStep = OnboardingStep.createProfile;

  StreamSubscription<UserModel?>? _userSub;

  // ── Public state ───────────────────────────────────────────────────────────

  AuthStatus get status => _status;
  UserModel? get user => _user;
  String? get error => _error;
  OnboardingStep get onboardingStep => _onboardingStep;

  bool get isLoading => _status == AuthStatus.loading;
  bool get isAuthenticated => _status == AuthStatus.authenticated;
  bool get needsOnboarding => _status == AuthStatus.onboarding;
  bool get isSignedOut => _status == AuthStatus.unauthenticated;

  /// Convenience: the UID of the current user, or null.
  String? get uid => _user?.uid;

  // ── Initialisation ─────────────────────────────────────────────────────────

  void _init() {
    _userSub = _service.userStream.listen(
      _onUserChanged,
      onError: (Object err) {
        _status = AuthStatus.unauthenticated;
        _error = err.toString();
        notifyListeners();
      },
    );
  }

  void _onUserChanged(UserModel? userModel) {
    _user = userModel;
    _error = null;

    if (userModel == null) {
      _status = AuthStatus.unauthenticated;
      _onboardingStep = OnboardingStep.createProfile;
    } else {
      _onboardingStep = _service.onboardingStep(userModel);
      _status = _onboardingStep == OnboardingStep.complete
          ? AuthStatus.authenticated
          : AuthStatus.onboarding;
    }

    notifyListeners();
  }

  // ── Sign-in ────────────────────────────────────────────────────────────────

  /// Signs in with email and password.
  /// Returns true on success; sets [error] on failure.
  Future<bool> signInWithEmailPassword(String email, String password) async {
    _setLoading();
    final result = await _service.signInWithEmailPassword(email, password);
    if (result.isSuccess) return true;
    _setError(result.error ?? 'Sign-in failed.');
    return false;
  }

  /// Creates a new account.
  Future<bool> signUpWithEmailPassword({
    required String displayName,
    required String email,
    required String password,
    Role role = Role.student,
    String? institutionId,
    String? enrollmentNumber,
  }) async {
    _setLoading();
    final result = await _service.signUpWithEmailPassword(
      displayName: displayName,
      email: email,
      password: password,
      role: role,
      institutionId: institutionId,
      enrollmentNumber: enrollmentNumber,
    );
    if (result.isSuccess) return true;
    _setError(result.error ?? 'Registration failed.');
    return false;
  }

  // ── Phone / OTP ────────────────────────────────────────────────────────────

  String? _verificationId;
  int? _resendToken;

  String? get verificationId => _verificationId;

  Future<void> sendOtp({
    required String phoneNumber,
    required VoidCallback onCodeSent,
    required void Function(String error) onError,
  }) async {
    await _service.verifyPhoneNumber(
      phoneNumber: phoneNumber,
      onAutoVerified: (credential) async {
        final cred =
            await FirebaseAuth.instance.signInWithCredential(credential);
        // Auth state change listener fires automatically
        _ = cred;
      },
      onCodeSent: (verificationId, resendToken) {
        _verificationId = verificationId;
        _resendToken = resendToken;
        notifyListeners();
        onCodeSent();
      },
      onFailed: (e) => onError(_mapPhoneError(e)),
      resendToken: _resendToken,
    );
  }

  Future<bool> verifyOtp(String otp) async {
    if (_verificationId == null) {
      _setError('No verification session active. Please resend OTP.');
      return false;
    }
    _setLoading();
    final result = await _service.verifyOtp(
      verificationId: _verificationId!,
      otp: otp,
    );
    if (result.isSuccess) return true;
    _setError(result.error ?? 'OTP verification failed.');
    return false;
  }

  // ── Password reset ─────────────────────────────────────────────────────────

  Future<bool> sendPasswordReset(String email) async {
    clearError();
    return _service.sendPasswordResetEmail(email);
  }

  // ── Onboarding ─────────────────────────────────────────────────────────────

  Future<void> completeOnboarding(Map<String, dynamic> updates) async {
    final currentUid = uid;
    if (currentUid == null) return;
    clearError();
    try {
      await _service.completeOnboarding(currentUid, updates);
      // userStream will fire and update state automatically
    } catch (e) {
      _setError(e.toString());
    }
  }

  // ── Profile ────────────────────────────────────────────────────────────────

  Future<void> updateProfile({
    String? displayName,
    String? photoUrl,
    String? phone,
  }) async {
    final currentUid = uid;
    if (currentUid == null) return;
    try {
      await _service.updateProfile(
        uid: currentUid,
        displayName: displayName,
        photoUrl: photoUrl,
        phone: phone,
      );
    } catch (e) {
      _setError(e.toString());
    }
  }

  // ── Device registration ────────────────────────────────────────────────────

  Future<bool> registerDevice(StudentDevice device) async {
    final currentUid = uid;
    if (currentUid == null) return false;
    clearError();
    try {
      await _service.registerDevice(currentUid, device);
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  Future<bool> removeDevice(String deviceId) async {
    final currentUid = uid;
    if (currentUid == null) return false;
    clearError();
    try {
      await _service.removeDevice(currentUid, deviceId);
      return true;
    } catch (e) {
      _setError(e.toString());
      return false;
    }
  }

  // ── Sign out ───────────────────────────────────────────────────────────────

  Future<void> signOut() async {
    clearError();
    await _service.signOut();
  }

  // ── Error helpers ──────────────────────────────────────────────────────────

  void clearError() {
    if (_error != null) {
      _error = null;
      notifyListeners();
    }
  }

  void _setLoading() {
    _error = null;
    // Only notify if status actually changes to avoid redundant rebuilds
    if (_status != AuthStatus.loading) {
      _status = AuthStatus.loading;
      notifyListeners();
    }
  }

  void _setError(String message) {
    _error = message;
    // Restore status from the user's current auth state
    _status = _user != null
        ? (_onboardingStep == OnboardingStep.complete
            ? AuthStatus.authenticated
            : AuthStatus.onboarding)
        : AuthStatus.unauthenticated;
    notifyListeners();
  }

  String _mapPhoneError(FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-phone-number':
        return 'Invalid phone number format.';
      case 'too-many-requests':
        return 'Too many attempts. Please wait before trying again.';
      case 'quota-exceeded':
        return 'SMS quota exceeded. Please try email sign-in.';
      default:
        return e.message ?? 'Phone verification failed.';
    }
  }

  @override
  void dispose() {
    _userSub?.cancel();
    super.dispose();
  }
}
