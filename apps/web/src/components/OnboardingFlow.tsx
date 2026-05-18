'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from 'firebase/auth';
import { QRCodeSVG } from 'qrcode.react';
import { createInstitution, getOwnedInstitution, joinInstitution } from '@/lib/db/institutions';

type Step = 'choose' | 'institution' | 'student' | 'done-inst' | 'done-student';

const STEP_ORDER: Step[] = ['choose', 'institution', 'student', 'done-inst', 'done-student'];

const STEP_META: Partial<Record<Step, { n: number; total: number; title: string; sub: string }>> = {
  choose:      { n: 1, total: 3, title: 'Welcome to Attendly', sub: "Let's get you set up — who are you?" },
  institution: { n: 2, total: 3, title: 'Your institution',    sub: 'Tell us about your school or organisation.' },
  student:     { n: 2, total: 3, title: 'Join your institution', sub: 'Enter the 6-character code from your admin.' },
  'done-inst': { n: 3, total: 3, title: 'Institution created!', sub: "Share the code with your students." },
  'done-student': { n: 3, total: 3, title: "You're in!", sub: "Welcome to your institution." },
};

interface Props {
  user: User;
  onComplete: () => void;
}

const slide = {
  enter:  (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export function OnboardingFlow({ user, onComplete }: Props) {
  const [step, setStep] = useState<Step>('choose');
  const [dir, setDir] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [instName, setInstName] = useState('');
  const [instType, setInstType] = useState('school');
  const [createdCode, setCreatedCode] = useState('');
  const [createdId, setCreatedId] = useState('');

  const [code, setCode] = useState('');
  const [joiningRole, setJoiningRole] = useState<'student' | 'teacher'>('student');
  const [joinedName, setJoinedName] = useState('');

  const goTo = (next: Step, forward = true) => {
    setDir(forward ? 1 : -1);
    setError('');
    setStep(next);
  };

  // Driver.js walkthrough on first view of 'choose' step
  useEffect(() => {
    const seen = sessionStorage.getItem('atd_onboard_tour');
    if (seen || step !== 'choose') return;
    sessionStorage.setItem('atd_onboard_tour', '1');
    const timer = setTimeout(() => {
      try {
        import('driver.js').then(({ driver }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore — CSS import only works at runtime, not typed
          try { import('driver.js/dist/driver.css').catch(() => {}); } catch {}
          const d = driver({
            animate: true,
            showProgress: true,
            steps: [
              {
                element: '#onboard-choose-inst',
                popover: {
                  title: '🏫 Institution admin',
                  description: "Create a school or organisation. You'll get a 6-character code to share with students.",
                  side: 'right',
                },
              },
              {
                element: '#onboard-choose-student',
                popover: {
                  title: '🎓 Student or teacher',
                  description: 'Ask your admin for the institution code, then join with one tap.',
                  side: 'left',
                },
              },
            ],
          });
          d.drive();
        });
      } catch { /* driver.js unavailable */ }
    }, 600);
    return () => clearTimeout(timer);
  }, [step]);

  const handleCreateInstitution = async () => {
    if (!instName.trim()) { setError('Enter your institution name.'); return; }
    setBusy(true); setError('');
    try {
      const existing = await getOwnedInstitution(user.uid);
      if (existing) {
        setCreatedCode(existing.code);
        setCreatedId(existing.id);
        goTo('done-inst');
        return;
      }
      const id = await createInstitution({ name: instName.trim(), type: instType }, user.uid);
      const inst = await import('@/lib/db/institutions').then(m => m.getInstitution(id));
      setCreatedCode(inst?.code ?? '');
      setCreatedId(id);
      goTo('done-inst');
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
      const inst = await joinInstitution(user.uid, code.trim(), joiningRole);
      setJoinedName(inst.name);
      goTo('done-student');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code not found or inactive.');
    } finally {
      setBusy(false);
    }
  };

  const meta = STEP_META[step];

  return (
    <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-cream-50 dark:bg-[#13161D] rounded-2xl border border-ink/10 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Progress bar */}
        {meta && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-ink/6 dark:bg-white/8">
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: `${(meta.n / meta.total) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        )}

        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          {meta && (
            <div className="flex gap-1 mb-4">
              {Array.from({ length: meta.total }, (_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
                  i < meta.n ? 'bg-accent' : 'bg-ink/10 dark:bg-white/10'
                } ${i === meta.n - 1 ? 'flex-1' : 'w-6'}`} />
              ))}
            </div>
          )}
          <div className="font-display text-[1.8rem] leading-none mb-1.5 dark:text-cream-50">
            {meta?.title ?? 'Welcome'}
          </div>
          <div className="text-[13px] text-ink-mute">{meta?.sub}</div>
        </div>

        {/* Animated content */}
        <div className="px-8 pb-8 pt-2" style={{ minHeight: 240 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {/* Choose */}
              {step === 'choose' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button id="onboard-choose-inst" onClick={() => goTo('institution')}
                    className="group rounded-xl border-2 border-ink/10 dark:border-white/10 hover:border-accent hover:bg-accent/5 p-5 text-left transition-all">
                    <div className="text-2xl mb-2">🏫</div>
                    <div className="font-medium text-[14px] dark:text-cream-50">I run an institution</div>
                    <div className="text-[11.5px] text-ink-mute mt-1">School, college, or org</div>
                  </button>
                  <button id="onboard-choose-student" onClick={() => goTo('student')}
                    className="group rounded-xl border-2 border-ink/10 dark:border-white/10 hover:border-accent hover:bg-accent/5 p-5 text-left transition-all">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-medium text-[14px] dark:text-cream-50">I&apos;m a student</div>
                    <div className="text-[11.5px] text-ink-mute mt-1">Or teacher joining an institution</div>
                  </button>
                </div>
              )}

              {/* Create institution */}
              {step === 'institution' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] tracking-wide text-ink-mute mb-1.5">Institution name *</label>
                    <input value={instName} onChange={e => setInstName(e.target.value)}
                      placeholder="e.g. Delhi Public School"
                      className="w-full text-[13px] bg-cream-100 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-accent/60 transition-colors dark:text-cream-50" />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-wide text-ink-mute mb-1.5">Type</label>
                    <select value={instType} onChange={e => setInstType(e.target.value)}
                      className="w-full text-[13px] bg-cream-100 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-accent/60 dark:text-cream-50">
                      <option value="school">School</option>
                      <option value="college">College / University</option>
                      <option value="coaching">Coaching / Tutoring</option>
                      <option value="corporate">Corporate / Company</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {error && <p className="text-[12px] text-red-500">{error}</p>}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => goTo('choose', false)}
                      className="rounded-xl border border-ink/10 dark:border-white/10 px-4 py-2.5 text-[13px] text-ink-mute dark:text-white/60 hover:text-ink dark:hover:text-cream-50 transition-all">
                      ← Back
                    </button>
                    <button onClick={handleCreateInstitution} disabled={busy}
                      className="flex-1 rounded-xl bg-accent text-cream-50 px-4 py-2.5 text-[13px] font-medium hover:bg-accent/90 transition-all disabled:opacity-60">
                      {busy ? 'Creating…' : 'Create institution →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Join as student/teacher */}
              {step === 'student' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[11px] tracking-wide text-ink-mute mb-2">I am joining as…</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['student', 'teacher'] as const).map(r => (
                        <button key={r} onClick={() => setJoiningRole(r)}
                          className={`rounded-xl border-2 py-2.5 text-[13px] font-medium transition-all ${
                            joiningRole === r
                              ? 'border-accent bg-accent/8 text-accent'
                              : 'border-ink/10 dark:border-white/10 text-ink-mute hover:border-ink/20 dark:hover:border-white/20'
                          }`}>
                          {r === 'student' ? '🎓 Student' : '📚 Teacher'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-wide text-ink-mute mb-1.5">Institution code</label>
                    <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                      placeholder="A3KX72" maxLength={6}
                      className="w-full text-[2rem] font-mono tracking-[0.3em] text-center bg-cream-100 dark:bg-white/5 border border-ink/10 dark:border-white/10 rounded-xl px-3 py-3 focus:outline-none focus:border-accent/60 transition-colors uppercase dark:text-cream-50" />
                    <p className="text-[11px] text-ink-mute mt-1.5">Ask your admin for the 6-character code.</p>
                  </div>
                  {error && <p className="text-[12px] text-red-500">{error}</p>}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => goTo('choose', false)}
                      className="rounded-xl border border-ink/10 dark:border-white/10 px-4 py-2.5 text-[13px] text-ink-mute dark:text-white/60 hover:text-ink dark:hover:text-cream-50 transition-all">
                      ← Back
                    </button>
                    <button onClick={handleJoinInstitution} disabled={busy}
                      className="flex-1 rounded-xl bg-accent text-cream-50 px-4 py-2.5 text-[13px] font-medium hover:bg-accent/90 transition-all disabled:opacity-60">
                      {busy ? 'Joining…' : 'Join institution →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Done: institution created */}
              {step === 'done-inst' && (
                <div className="space-y-4 pt-2">
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5 space-y-4">
                    <div className="text-[13px] font-semibold text-green-800 dark:text-green-300">🎉 Institution created!</div>
                    <p className="text-[12px] text-green-700 dark:text-green-400">Share this code with your students and teachers:</p>
                    <div className="flex gap-4 items-center">
                      <div className="bg-white p-2 rounded-xl flex-shrink-0">
                        <QRCodeSVG value={`attendly://join?code=${createdCode}`} size={72} bgColor="#ffffff" fgColor="#0B1220" level="M" />
                      </div>
                      <div>
                        <div className="font-mono text-[2rem] font-bold tracking-[0.3em] text-ink dark:text-cream-50 leading-none">{createdCode}</div>
                        <button onClick={() => navigator.clipboard.writeText(createdCode).catch(() => {})}
                          className="mt-2 text-[11px] text-ink-mute hover:text-ink border border-ink/10 rounded-lg px-2.5 py-1 transition-colors">
                          📋 Copy
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => { onComplete(); }}
                    className="w-full rounded-xl bg-accent text-cream-50 py-3 text-[13px] font-medium hover:bg-accent/90 transition-all">
                    Go to dashboard →
                  </button>
                </div>
              )}

              {/* Done: joined */}
              {step === 'done-student' && (
                <div className="space-y-4 pt-2">
                  <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 p-5">
                    <div className="text-[13px] font-semibold text-green-800 dark:text-green-300 mb-2">
                      🎉 Joined {joinedName} as {joiningRole}!
                    </div>
                    <p className="text-[12px] text-green-700 dark:text-green-400">
                      {joiningRole === 'teacher'
                        ? 'Your admin will see you in Manage Users and can set your permissions.'
                        : 'Your teacher will see you in the student list.'}
                    </p>
                  </div>
                  <button onClick={() => { onComplete(); }}
                    className="w-full rounded-xl bg-accent text-cream-50 py-3 text-[13px] font-medium hover:bg-accent/90 transition-all">
                    Continue →
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
