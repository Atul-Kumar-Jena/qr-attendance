import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

export '../models/user_model.dart' show UserModel, Role;

enum OnboardingStep { none, createProfile, name, institution, device, complete }

class AuthResult {
  final bool success;
  final String? error;
  const AuthResult({required this.success, this.error});
  factory AuthResult.ok() => const AuthResult(success: true);
  factory AuthResult.err(String e) => AuthResult(success: false, error: e);
}

class AuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  final FlutterSecureStorage _secure = const FlutterSecureStorage();

  User? get currentUser => _auth.currentUser;

  Stream<UserModel?> get userStream {
    return _auth.authStateChanges().asyncExpand((user) {
      if (user == null) return Stream.value(null);
      return _db.collection('users').doc(user.uid).snapshots().map((snap) {
        if (!snap.exists) return null;
        return UserModel.fromSnapshot(snap as DocumentSnapshot<Map<String, dynamic>>);
      });
    });
  }

  Future<AuthResult> sendSignInLink(String email) async {
    try {
      final settings = ActionCodeSettings(
        url: 'https://attendly-the-solution.firebaseapp.com/auth?email=${Uri.encodeComponent(email)}',
        handleCodeInApp: true,
        androidPackageName: 'com.attendly.app',
        androidInstallApp: true,
        iOSBundleId: 'com.attendly.app',
      );
      await _auth.sendSignInLinkToEmail(email: email, actionCodeSettings: settings);
      await _secure.write(key: 'pending_email', value: email);
      return AuthResult.ok();
    } on FirebaseAuthException catch (e) {
      return AuthResult.err(e.message ?? 'Failed to send OTP link');
    }
  }

  Future<AuthResult> confirmSignInLink(String link) async {
    try {
      if (!_auth.isSignInWithEmailLink(link)) return AuthResult.err('Invalid link');
      final email = await _secure.read(key: 'pending_email');
      if (email == null) return AuthResult.err('No pending sign-in');
      await _auth.signInWithEmailLink(emailLink: link, email: email);
      await _secure.delete(key: 'pending_email');
      return AuthResult.ok();
    } on FirebaseAuthException catch (e) {
      return AuthResult.err(e.message ?? 'Sign-in failed');
    }
  }

  Future<void> signOut() async => _auth.signOut();

  Future<AuthResult> updateDisplayName(String uid, String name) async {
    try {
      await _db.collection('users').doc(uid).update({'displayName': name});
      await _auth.currentUser?.updateDisplayName(name);
      return AuthResult.ok();
    } catch (e) {
      return AuthResult.err(e.toString());
    }
  }

  Future<AuthResult> joinInstitution(String uid, String code) async {
    try {
      final q = await _db.collection('institutions')
          .where('joinCode', isEqualTo: code.toUpperCase()).limit(1).get();
      if (q.docs.isEmpty) return AuthResult.err('Institution not found');
      await _db.collection('users').doc(uid).update({'institutionId': q.docs.first.id});
      return AuthResult.ok();
    } catch (e) {
      return AuthResult.err(e.toString());
    }
  }

  Future<UserModel> ensureUserDoc(User firebaseUser) async {
    final ref = _db.collection('users').doc(firebaseUser.uid);
    final snap = await ref.get();
    if (snap.exists) {
      await ref.update({'lastSignIn': FieldValue.serverTimestamp()});
      return UserModel.fromSnapshot(snap as DocumentSnapshot<Map<String, dynamic>>);
    }
    final newUser = UserModel(
      uid: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      displayName: firebaseUser.displayName ?? '',
      photoUrl: firebaseUser.photoURL,
      role: Role.student,
      onboardingComplete: false,
      createdAt: DateTime.now(),
      lastSignInAt: DateTime.now(),
    );
    await ref.set(newUser.toMap());
    return newUser;
  }

  OnboardingStep onboardingStep(UserModel? user) {
    if (user == null) return OnboardingStep.none;
    if (user.displayName.isEmpty) return OnboardingStep.name;
    if (user.institutionId == null) return OnboardingStep.institution;
    if (user.registeredDevices.isEmpty) return OnboardingStep.device;
    return OnboardingStep.complete;
  }
}
