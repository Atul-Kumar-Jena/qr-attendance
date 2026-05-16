'use client';

import { useState } from 'react';
import type { User } from 'firebase/auth';

type Step = 'choose' | 'institution' | 'student' | 'done-inst' | 'done-student';

interface Props {
  user: User;
  onComplete: () => void;
}

export function OnboardingFlow({ user, onComplete }: Props) {
  const [step, setStep] = useState<Step>('choose');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Institution form
  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('school');
  const [createdCode, setCreatedCode] = useState('');
  const [createdId, setCreatedId] = useState('');

  // Student/teacher join form
  const [code, setCode] = useState('');
  const [joiningRole, setJoiningRole] = useState<'student' | 'teacher'>('student');
  const [joinedName, setJoinedName] = useState('');

  const handleCreateInstitution = async () => {
    if (!instName.trim()) { setError('Please enter your institution name.'); return; }
    setBusy(true); setError('');
    try {
      const { createInstitution, getOwnedInstitution } = await import('@/lib/firestore-db');
      const existing = await getOwnedInstitution(user.uid);
      if (existing) {
        setError('You already own an institution. Contact us to add more.');
        setBusy(false);
        return;
      }
      const id = await createInstitution({ name: instName.trim(), type: instType }, user.uid);
      // Fetch the generated code
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      if (db) {
        const snap = await getDoc(doc(db, 'institutions', id));
        setCreatedCode(snap.data()?.code ?? '');
      }
      setCreatedId(id);
      setStep('done-inst');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoinInstitution = async () => {
    if (code.trim().length < 6) { setError('Enter a valid 6-character code.'); return; }
    setBusy(true); setError('');
    try {
      const { joinInstitutionByCode } = await import('@/lib/firestore-db');
      const inst = await joinInstitutionByCode(user.uid, code.trim(), joiningRole);
      if (!inst) { setError('No institution found with that code. Double-check and try again.'); setBusy(false); return; }
      setJoinedName(inst.name);
      setStep('done-student');
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-cream-50 dark:bg-[#13161D] border border-ink/10 dark:border-white/10 shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="font-display text-[2rem] leading-none mb-1">Welcome to Attendly</div>
          <div className="text-[13px] text-ink-mute">
            {step === 'choose' && "Let's get you set up. Who are you?"}
            {step === 'institution' && 'Tell us about your institution.'}
            {step === 'student' && 'Enter your institution code.'}
            {(step === 'done-inst' || step === 'done-student') && 'You\'re all set!'}
          </div>
        </div>

        <div className="px-8 pb-8 pt-2 space-y-4">

          {/* Step: choose */}
          {step === 'choose' && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => setStep('institution')}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-5 text-left transition-all hover:bg-accent/5">
                <div className="text-2xl mb-2">🏫</div>
                <div className="font-medium text-[14px]">I run an institution</div>
                <div className="text-[11.5px] text-ink-mute mt-1">School, college, or organisation</div>
              </button>
              <button onClick={() => setStep('student')}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-5 text-left transition-all hover:bg-accent/5">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-medium text-[14px]">I'm a student</div>
                <div className="text-[11.5px] text-ink-mute mt-1">Or teacher joining an institution</div>
              </button>
            </div>
          )}

          {/* Step: create institution */}
          {step === 'institution' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Institution name</label>
                <input
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="e.g. Delhi Public School"
                  className="w-full text-[13px] bg-cream-100 dark:bg-white/5 border border-ink/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Type</label>
                <select value={instType} onChange={(e) => setInstType(e.target.value)}
                  className="w-full text-[13px] bg-cream-100 dark:bg-white/5 border border-ink/10 rounded-lg px-3 py-2.5 focus:outline-none focus:border-accent/50">
                  <option value="school">School</option>
                  <option value="college">College / University</option>
                  <option value="coaching">Coaching / Tutoring</option>
                  <option value="corporate">Corporate / Company</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setStep('choose'); setError(''); }}
                  className="rounded-lg border border-ink/10 px-4 py-2 text-[13px] text-ink-mute hover:text-ink transition-all">
                  Back
                </button>
                <button onClick={handleCreateInstitution} disabled={busy}
                  className="flex-1 rounded-lg bg-accent text-cream-50 px-4 py-2 text-[13px] font-medium hover:bg-accent/90 transition-all disabled:opacity-60">
                  {busy ? 'Creating…' : 'Create institution'}
                </button>
              </div>
            </div>
          )}

          {/* Step: join as student/teacher */}
          {step === 'student' && (
            <div className="space-y-4 pt-2">
              {/* Role selector */}
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute mb-2">I am joining as…</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['student', 'teacher'] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setJoiningRole(r)}
                      className={`rounded-lg border-2 py-2.5 text-[13px] font-medium transition-all ${
                        joiningRole === r ? 'border-accent bg-accent/8 text-accent' : 'border-ink/10 text-ink-mute hover:border-ink/20'
                      }`}>
                      {r === 'student' ? '🎓 Student' : '📚 Teacher'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Institution code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A3KX72"
                  maxLength={6}
                  className="w-full text-[20px] font-mono tracking-[0.25em] text-center bg-cream-100 dark:bg-white/5 border border-ink/10 rounded-lg px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors uppercase"
                />
                <p className="text-[11px] text-ink-mute mt-1.5">Ask your admin for the 6-character institution code.</p>
              </div>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setStep('choose'); setError(''); }}
                  className="rounded-lg border border-ink/10 px-4 py-2 text-[13px] text-ink-mute hover:text-ink transition-all">
                  Back
                </button>
                <button onClick={handleJoinInstitution} disabled={busy}
                  className="flex-1 rounded-lg bg-accent text-cream-50 px-4 py-2 text-[13px] font-medium hover:bg-accent/90 transition-all disabled:opacity-60">
                  {busy ? 'Joining…' : 'Join institution'}
                </button>
              </div>
            </div>
          )}

          {/* Done: institution created */}
          {step === 'done-inst' && (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5 space-y-3">
                <div className="text-[13px] font-medium text-green-800 dark:text-green-300">
                  🎉 Institution created!
                </div>
                <p className="text-[12.5px] text-green-700 dark:text-green-400">
                  Share this code with your students and teachers so they can join:
                </p>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-[2rem] font-bold tracking-[0.3em] text-ink dark:text-white">
                    {createdCode}
                  </div>
                  <button onClick={() => navigator.clipboard.writeText(createdCode)}
                    className="text-[11px] text-ink-mute hover:text-ink border border-ink/10 rounded px-2 py-1 transition-colors">
                    Copy
                  </button>
                </div>
                <p className="text-[11px] text-ink-mute">
                  You can always find this code in your Institution settings.
                </p>
              </div>
              <button onClick={() => { onComplete(); window.location.reload(); }}
                className="w-full rounded-lg bg-accent text-cream-50 px-4 py-2.5 text-[13px] font-medium hover:bg-accent/90 transition-all">
                Go to dashboard →
              </button>
            </div>
          )}

          {/* Done: joined as student/teacher */}
          {step === 'done-student' && (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5">
                <div className="text-[13px] font-medium text-green-800 dark:text-green-300 mb-1">
                  🎉 Joined {joinedName} as {joiningRole}!
                </div>
                <p className="text-[12.5px] text-green-700 dark:text-green-400">
                  {joiningRole === 'teacher'
                    ? 'An admin will see you in Manage Users and can set your permissions.'
                    : 'Your teacher will see you in the student list. Open the Attendly app to mark attendance.'}
                </p>
              </div>
              <button onClick={() => { onComplete(); window.location.reload(); }}
                className="w-full rounded-lg bg-accent text-cream-50 px-4 py-2.5 text-[13px] font-medium hover:bg-accent/90 transition-all">
                Continue →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
