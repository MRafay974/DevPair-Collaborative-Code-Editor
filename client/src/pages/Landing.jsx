import { Link } from "react-router-dom";

/** Inline SVG logo so you don’t need assets */
function DevPairLogo({ className = "w-28 h-28" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="DevPair logo">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" fill="url(#grad)" opacity="0.15" />
      <path d="M70 70 L45 100 L70 130" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M130 70 L155 100 L130 130" fill="none" stroke="url(#grad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="95" cy="95" r="6" fill="#22D3EE" />
      <circle cx="105" cy="105" r="6" fill="#6366F1" />
      <rect x="60" y="150" width="80" height="6" rx="3" fill="url(#grad)" opacity="0.5" />
    </svg>
  );
}

export default function Landing() {
  return (
    <div data-theme="light" className="min-h-screen bg-base-200">
      {/* NAV REMOVED — global navbar will render from your Layout */}

      {/* HERO */}
      <section className="hero">
        <div className="hero-content text-center py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mx-auto mb-6">
              <DevPairLogo className="w-24 h-24 md:w-28 md:h-28 mx-auto" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Pair-program in real time.
            </h1>
            <p className="py-6 text-base md:text-lg text-base-content/70">
              DevPair is a collaborative code editor with live cursors, chat, and one-click code
              execution. Perfect for pair programming, interviews, and workshops.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
              <a href="#how" className="btn btn-ghost">How it works</a>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="text-3xl">⚡</div>
                <h3 className="card-title">Real-time Collaboration</h3>
                <p>See changes instantly. Code together with live updates and chat.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="text-3xl">🧠</div>
                <h3 className="card-title">VS-Code-like Editor</h3>
                <p>Monaco under the hood: syntax highlight, themes, and language modes.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="text-3xl">▶️</div>
                <h3 className="card-title">Run Your Code</h3>
                <p>Execute code via sandboxed runtimes and view output immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-4 md:px-8 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8">How to use DevPair</h2>
          <ol className="timeline timeline-vertical">
            <li>
              <div className="timeline-start timeline-box">
                <strong>Create or Join a Room</strong>
                <p className="text-sm opacity-70">Generate a friendly room ID or paste one to join.</p>
              </div>
              <div className="timeline-middle">🎟️</div>
              <hr className="bg-primary" />
            </li>
            <li>
              <hr className="bg-primary" />
              <div className="timeline-end timeline-box">
                <strong>Invite Collaborators</strong>
                <p className="text-sm opacity-70">Share the room link. They appear in the user list instantly.</p>
              </div>
              <div className="timeline-middle">👥</div>
              <hr className="bg-primary" />
            </li>
            <li>
              <hr className="bg-primary" />
              <div className="timeline-start timeline-box">
                <strong>Code & Chat</strong>
                <p className="text-sm opacity-70">Type together with live updates and chat to coordinate.</p>
              </div>
              <div className="timeline-middle">⌨️</div>
              <hr className="bg-primary" />
            </li>
            <li>
              <hr className="bg-primary" />
              <div className="timeline-end timeline-box">
                <strong>Run & Save</strong>
                <p className="text-sm opacity-70">Execute your code, view output, and auto-save the session.</p>
              </div>
              <div className="timeline-middle">💾</div>
            </li>
          </ol>
        </div>
      </section>

      {/* WHERE TO USE */}
      <section className="px-4 md:px-8 pb-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">Great for…</h2>
        </div>
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-4 px-4 md:px-0">
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl">🤝</div>
              <h3 className="font-semibold">Pair Programming</h3>
              <p className="text-sm opacity-70">Move faster together with clear coordination.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl">🎯</div>
              <h3 className="font-semibold">Interviews</h3>
              <p className="text-sm opacity-70">Share a room and evaluate in real time.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl">🏫</div>
              <h3 className="font-semibold">Bootcamps</h3>
              <p className="text-sm opacity-70">Teach and debug with your cohort live.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow">
            <div className="card-body items-center text-center">
              <div className="text-4xl">🧪</div>
              <h3 className="font-semibold">Workshops</h3>
              <p className="text-sm opacity-70">Hands-on sessions with instant feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 md:px-8 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">What people say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content w-10 rounded-full">
                      <span>A</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Ayesha • Instructor</h4>
                    <p className="text-sm opacity-60">@codecamp</p>
                  </div>
                </div>
                <p className="mt-3">“DevPair made my live classes 10× smoother. Students collaborate like they’re on the same machine.”</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content w-10 rounded-full">
                      <span>R</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rafay • SWE</h4>
                    <p className="text-sm opacity-60">@devsquad</p>
                  </div>
                </div>
                <p className="mt-3">“The real-time editor + run button is perfect for quick pair debugging. We saved hours.”</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow">
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-accent text-accent-content w-10 rounded-full">
                      <span>S</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sara • Student</h4>
                    <p className="text-sm opacity-60">@learnjs</p>
                  </div>
                </div>
                <p className="mt-3">“No setup. Just share a link and start coding together. Love the simplicity.”</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="hero rounded-box bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="hero-content text-center">
              <div className="max-w-2xl py-10">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ready to collaborate?</h2>
                <p className="text-base-content/70 mb-5">
                  Create a room, invite your partner, and start building — all in the browser.
                </p>
                <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER — horizontal layout */}
    <footer className="bg-base-100 border-t">
  <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row justify-between">
    
    {/* Left: Logo + tagline */}
    <div className="mb-6 md:mb-0">
      <div className="flex items-center gap-3">
        <DevPairLogo className="w-10 h-10" />
        <div>
          <p className="font-bold">DevPair</p>
          <p className="text-sm opacity-70">Collaborate, learn, ship.</p>
        </div>
      </div>
    </div>

    {/* Right: 3 columns */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
      <div>
        <h6 className="font-semibold mb-2">Product</h6>
        <ul className="space-y-1">
          <li><a href="#" className="link link-hover">Features</a></li>
          <li><a href="#" className="link link-hover">How it works</a></li>
          <li><a href="#" className="link link-hover">Pricing (soon)</a></li>
        </ul>
      </div>

      <div>
        <h6 className="font-semibold mb-2">Company</h6>
        <ul className="space-y-1">
          <li><a href="#" className="link link-hover">About</a></li>
          <li><a href="#" className="link link-hover">Blog</a></li>
          <li><a href="#" className="link link-hover">Contact</a></li>
        </ul>
      </div>

      <div>
        <h6 className="font-semibold mb-2">Legal</h6>
        <ul className="space-y-1">
          <li><a href="#" className="link link-hover">Terms</a></li>
          <li><a href="#" className="link link-hover">Privacy</a></li>
        </ul>
      </div>
    </div>
  </div>

  {/* Bottom bar */}
  <div className="border-t mt-6">
    <div className="mx-auto max-w-6xl px-4 py-4 text-xs opacity-70 flex flex-col md:flex-row items-center justify-between gap-2">
      <span>© {new Date().getFullYear()} DevPair. All rights reserved.</span>
      <span>Made with ❤️ using React, Tailwind & daisyUI.</span>
    </div>
  </div>
</footer>


    </div>
  );
}
