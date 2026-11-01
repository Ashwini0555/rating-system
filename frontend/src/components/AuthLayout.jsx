import ThemeToggle from './ThemeToggle';
export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="auth-split">
      <aside className="auth-art" aria-hidden="true">
        <div className="art-brand">
          <span className="logo-mark">★</span> Rating System
        </div>
        <span className="shape s1" />
        <span className="shape s2" />
        <span className="shape s3" />
        <span className="shape s4" />
        <span className="shape s5" />
        <div className="art-copy">
          
          <h2>Rate the stores you love.</h2>
          <p>Discover stores, share your rating and see what others think.</p>
        </div>
      </aside>

      <section className="auth-panel">
        <div className="auth-theme"><ThemeToggle /></div>
        <div className="auth-box">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
          {footer && <p className="auth-foot">{footer}</p>}
        </div>
      </section>
    </div>
  );
}