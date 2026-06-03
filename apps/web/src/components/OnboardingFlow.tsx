'use client';

import { useState } from 'react';
import type { User } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { createInstitution, getOwnedInstitution, joinInstitutionByCode } from '@/lib/firestore-db';

type Step = 'choose' | 'institution' | 'student' | 'professor-solo' | 'sudo-prof' | 'done-inst' | 'done-student' | 'done-solo';

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
      const existing = await getOwnedInstitution(user.uid);
      if (existing) {
        setError('You already own an institution. Contact us to add more.');
        setBusy(false);
        return;
      }
      const id = await createInstitution({ name: instName.trim(), type: instType }, user.uid);
      if (db) {
        const snap = await getDoc(doc(db, 'institutions', id));
        setCreatedCode(snap.data()?.code ?? '');
      }
      setCreatedId(id);
      setStep('done-inst');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoinInstitution = async () => {
    if (code.trim().length < 6) { setError('Enter a valid 6-character code.'); return; }
    setBusy(true); setError('');
    try {
      const inst = await joinInstitutionByCode(user.uid, code.trim(), joiningRole);
      if (!inst) { setError('No institution found with that code. Double-check and try again.'); setBusy(false); return; }
      setJoinedName(inst.name);
      setStep('done-student');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  // Individual professor: create a personal one-person "institution" so the
  // dashboard, class creation, sessions and attendance reports all work the
  // same as institution-bound flows — no special case needed downstream.
  const handleCreateSolo = async () => {
    setBusy(true); setError('');
    try {
      const displayName = (user.displayName ?? user.email ?? 'Professor').split('@')[0];
      const id = await createInstitution({ name: `${displayName} — Personal`, type: 'other' }, user.uid);
      if (db) {
        await updateDoc(doc(db, 'users', user.uid), {
          role: 'admin', institutionId: id, onboardingDone: true,
          isIndividualProfessor: true, updatedAt: serverTimestamp(),
        });
      }
      setCreatedId(id);
      setStep('done-solo');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/60 backdrop-blur-sm p-3 sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-cream-50 dark:bg-[#13161D] border border-ink/10 dark:border-white/10 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-3 sm:pb-4">
          {/* Step progress dots — hide on every done-* terminal */}
          {!step.startsWith('done-') && (
            <div className="flex items-center gap-1.5 mb-5">
              {[1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    (i === 1)
                      ? (step === 'choose' ? 'w-6 bg-accent' : 'w-3 bg-accent/40')
                      : (step !== 'choose' ? 'w-6 bg-accent' : 'w-3 bg-ink/10')
                  }`}
                />
              ))}
            </div>
          )}
          <div className="font-display text-[1.6rem] sm:text-[2rem] leading-none mb-1">Welcome to Attendly</div>
          <div className="text-[12.5px] sm:text-[13px] text-ink-mute">
            {step === 'choose' && "Let's get you set up. Who are you?"}
            {step === 'institution' && 'Tell us about your institution.'}
            {step === 'student' && 'Enter your institution code.'}
            {step === 'sudo-prof' && 'Enter your institution code.'}
            {step === 'professor-solo' && 'One-person workspace setup.'}
            {step.startsWith('done-') && "You're all set!"}
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-4">

          {/* Step: choose — 4 roles per Phase 4 spec */}
          {step === 'choose' && (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-2">
              <button onClick={() => { setStep('student'); setJoiningRole('student'); }}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-3.5 sm:p-5 text-left transition-all hover:bg-accent/5 active:scale-[0.98]">
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🎓</div>
                <div className="font-medium text-[13px] sm:text-[14px]">I&apos;m a student</div>
                <div className="text-[11px] sm:text-[11.5px] text-ink-mute mt-1">Join with a code</div>
              </button>
              <button onClick={() => setStep('institution')}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-3.5 sm:p-5 text-left transition-all hover:bg-accent/5 active:scale-[0.98]">
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">🏫</div>
                <div className="font-medium text-[13px] sm:text-[14px]">Run an institution</div>
                <div className="text-[11px] sm:text-[11.5px] text-ink-mute mt-1">School / college / org</div>
              </button>
              <button onClick={() => setStep('professor-solo')}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-3.5 sm:p-5 text-left transition-all hover:bg-accent/5 active:scale-[0.98]">
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">👤</div>
                <div className="font-medium text-[13px] sm:text-[14px]">Individual professor</div>
                <div className="text-[11px] sm:text-[11.5px] text-ink-mute mt-1">Tutor / independent</div>
              </button>
              <button onClick={() => { setStep('sudo-prof'); setJoiningRole('teacher'); }}
                className="group rounded-xl border-2 border-ink/10 hover:border-accent p-3.5 sm:p-5 text-left transition-all hover:bg-accent/5 active:scale-[0.98]">
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">📚</div>
                <div className="font-medium text-[13px] sm:text-[14px]">Sudo admin / Prof</div>
                <div className="text-[11px] sm:text-[11.5px] text-ink-mute mt-1">Join as faculty</div>
              </button>
            </div>
          )}

          {/* Step: individual professor — confirm + auto-create personal institution */}
          {step === 'professor-solo' && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl bg-accent/8 border border-accent/20 p-4 text-[12.5px] text-ink leading-relaxed">
                <div className="font-medium mb-1">Personal workspace</div>
                We&apos;ll set up a one-person workspace under your name. You can create classes,
                share join codes with your students and run live QR sessions — no institution
                membership required.
              </div>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setStep('choose'); setError(''); }}
                  className="rounded-lg border border-ink/10 px-4 py-2 text-[13px] text-ink-mute hover:text-ink transition-all">
                  Back
                </button>
                <button onClick={handleCreateSolo} disabled={busy}
                  className="flex-1 rounded-lg btn-solid px-4 py-2 text-[13px] font-medium transition-all disabled:opacity-60">
                  {busy ? 'Setting up…' : 'Create my workspace'}
                </button>
              </div>
            </div>
          )}

          {/* Step: sudo admin / professor under institution — reuse the join form
              but pre-locked to teacher role */}
          {step === 'sudo-prof' && (
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-[11px] tracking-wide text-ink-mute mb-1">Institution code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. A3KX72"
                  maxLength={6}
                  className="w-full text-[20px] font-mono tracking-[0.25em] text-center bg-cream-100 dark:bg-white/5 border border-ink/10 rounded-lg px-3 py-3 focus:outline-none focus:border-accent/50 transition-colors uppercase"
                />
                <p className="text-[11px] text-ink-mute mt-1.5">
                  Ask your admin for the 6-character code. They can then promote you to
                  sudo admin or fine-tune your permissions in Manage Users.
                </p>
              </div>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => { setStep('choose'); setError(''); }}
                  className="rounded-lg border border-ink/10 px-4 py-2 text-[13px] text-ink-mute hover:text-ink transition-all">
                  Back
                </button>
                <button onClick={handleJoinInstitution} disabled={busy}
                  className="flex-1 rounded-lg btn-solid px-4 py-2 text-[13px] font-medium transition-all disabled:opacity-60">
                  {busy ? 'Joining…' : 'Join as professor'}
                </button>
              </div>
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
                  className="flex-1 rounded-lg btn-solid px-4 py-2 text-[13px] font-medium transition-all disabled:opacity-60">
                  {busy ? 'Creating…' : 'Create institution'}
                </button>
              </div>
            </div>
          )}

          {/* Step: join as student */}
          {step === 'student' && (
            <div className="space-y-4 pt-2">
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
                  className="flex-1 rounded-lg btn-solid px-4 py-2 text-[13px] font-medium transition-all disabled:opacity-60">
                  {busy ? 'Joining…' : 'Join institution'}
                </button>
              </div>
            </div>
          )}

          {/* Done: institution created */}
          {step === 'done-inst' && (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5 space-y-4">
                <div className="text-[13px] font-medium text-green-800 dark:text-green-300">
                  🎉 Institution created!
                </div>
                <p className="text-[12.5px] text-green-700 dark:text-green-400">
                  Share this QR or code with your students and teachers so they can join:
                </p>
                {/* QR code of the join code */}
                <div className="flex gap-4 items-center">
                  <div className="bg-white p-2 rounded-xl flex-shrink-0">
                    <QRCodeSVG value={`attendly://join?code=${createdCode}`} size={80} bgColor="#ffffff" fgColor="#0B1220" level="M" />
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-[1.8rem] font-bold tracking-[0.3em] text-ink dark:text-white leading-none">
                      {createdCode}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.writeText(createdCode)}
                        className="text-[11px] text-ink-mute hover:text-ink border border-ink/10 rounded px-2 py-1 transition-colors">
                        Copy code
                      </button>
                      <a
                        href={`https://wa.me/?text=Join%20my%20institution%20on%20Attendly%20using%20code%3A%20${createdCode}`}
                        target="_blank" rel="noreferrer"
                        className="text-[11px] text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 rounded px-2 py-1 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        Share via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-ink-mute">
                  Find this code anytime in Institution settings.
                </p>
              </div>
              <button onClick={() => { onComplete(); window.location.reload(); }}
                className="w-full rounded-lg btn-solid px-4 py-2.5 text-[13px] font-medium transition-all">
                Go to dashboard →
              </button>
            </div>
          )}

          {/* Done: individual professor — personal workspace created */}
          {step === 'done-solo' && (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5 space-y-2">
                <div className="text-[13px] font-medium text-green-800 dark:text-green-300">
                  🎉 Personal workspace ready!
                </div>
                <p className="text-[12.5px] text-green-700 dark:text-green-400">
                  You can now create classes and run live QR sessions. Your unique workspace ID:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <code className="font-mono text-[11px] text-ink-mute truncate">{createdId}</code>
                  <button onClick={() => navigator.clipboard.writeText(createdId)}
                    className="text-[11px] text-ink-mute hover:text-ink border border-ink/10 rounded px-2 py-1 transition-colors">
                    Copy
                  </button>
                </div>
              </div>
              <button onClick={() => { onComplete(); window.location.reload(); }}
                className="w-full rounded-lg btn-solid px-4 py-2.5 text-[13px] font-medium transition-all">
                Open my dashboard →
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
                className="w-full rounded-lg btn-solid px-4 py-2.5 text-[13px] font-medium transition-all">
                Continue →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
