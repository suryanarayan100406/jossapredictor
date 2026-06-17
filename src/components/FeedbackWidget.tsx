'use client';
import React, { useState } from 'react';
import { MessageSquare, X, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 sm:w-96 p-5 bg-bg-overlay border border-border-strong rounded-md shadow-elevated"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" />
                <h3 className="font-medium text-white text-sm font-display">Send Feedback</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white rounded-[var(--radius-xs)] p-1 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-[var(--safe)] mb-3" />
                <h4 className="font-medium text-white text-sm mb-1 font-display">Feedback Received!</h4>
                <p className="text-xs text-[var(--text-secondary)]">Thank you for helping us improve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="feedback-email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
                    Email (Optional)
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-bg-elevated border border-border-default text-text-primary rounded-xs placeholder-text-muted focus:border-border-strong focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-message" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
                    Your Message
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={3}
                    placeholder="Tell us what you think or report an issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 bg-bg-elevated border border-border-default text-text-primary rounded-xs font-mono placeholder-text-muted focus:border-border-strong focus:outline-none transition-colors resize-none"
                  />
                </div>

                {error && <p className="text-xs text-[var(--ambitious-text)] font-medium font-mono">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className="w-full btn-brand justify-center font-mono text-xs uppercase tracking-wider"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
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
        className="flex items-center justify-center w-10 h-10 rounded-full bg-bg-elevated border border-border-default text-text-primary shadow-card hover:border-border-strong hover:text-white transition-colors cursor-pointer"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>
    </div>
  );
}
