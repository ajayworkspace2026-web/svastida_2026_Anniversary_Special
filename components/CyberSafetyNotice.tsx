"use client";

import { useEffect, useState } from "react";

export default function CyberSafetyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("svastida-cyber-notice-seen") !== "1") {
      setVisible(true);
    }
    // LocalStorage is an external browser-side system; this one-time hydration read is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    // The state update is kept inside the effect to avoid reading browser storage during render.
  }, []);

  function dismiss() {
    window.localStorage.setItem("svastida-cyber-notice-seen", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-5 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cyber-safety-title"
        className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl md:p-9"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">Cyber safety notice</p>
        <h2 id="cyber-safety-title" className="mt-3 text-4xl leading-none">Stay safe while shopping online.</h2>
        <p className="mt-5 text-sm leading-7 text-black/65">
          <strong className="text-black">Svastida Fashion will never ask for your OTP, UPI PIN, password, CVV, card PIN, banking credentials, or remote access to your device.</strong>
          We only request the contact and delivery details needed to handle your enquiry.
        </p>
        <p className="mt-4 text-sm leading-7 text-black/50">
          Never share a verification code or banking information with anyone claiming to represent Svastida.
          For help, contact <a className="font-medium text-black underline" href="mailto:svastidaa.helpdesk@gmail.com">svastidaa.helpdesk@gmail.com</a>.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-7 w-full rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white"
        >
          I understand
        </button>
      </section>
    </div>
  );
}
