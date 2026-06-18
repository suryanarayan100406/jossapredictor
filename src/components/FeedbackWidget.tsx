'use client';
import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const panelMotion = {
  initial: { opacity: 0, y: 16, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.96 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
};

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit feedback');
      }

      setSuccess(true);
      setMessage('');
      setEmail('');
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...panelMotion}
            className="mb-4 w-80 sm:w-96 p-5 bg-bg-elevated border border-border-default rounded-3xl shadow-elevated"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-brand-dim flex items-center justify-center">
                  <Heart className="w-4 h-4 text-brand" />
                </span>
                <h3 className="font-bold text-text-primary text-sm font-display">We&apos;d love your feedback</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary rounded-full p-1 hover:bg-bg-base transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="w-11 h-11 text-safe mb-3" />
                <h4 className="font-bold text-text-primary text-sm mb-1 font-display">Thank you! 🎉</h4>
                <p className="text-xs text-text-secondary">Your note helps us make RankScope better.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="feedback-email" className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Email (optional)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 bg-bg-base border border-border-default text-text-primary rounded-xl placeholder-text-muted focus:border-brand focus:ring-4 focus:ring-brand-dim focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-semibold text-text-secondary mb-1.5">
                    Your message
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={3}
                    placeholder="Tell us what you love or what we could fix..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full text-sm px-3 py-2.5 bg-bg-base border border-border-default text-text-primary rounded-xl placeholder-text-muted focus:border-brand focus:ring-4 focus:ring-brand-dim focus:outline-none transition-all resize-none"
                  />
                </div>

                {error && <p className="text-xs text-ambitious-text font-semibold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full btn-brand justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Send feedback"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-brand text-white shadow-[0_12px_28px_-10px_var(--brand-glow)] hover:bg-brand-hover hover:scale-105 transition-all cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
