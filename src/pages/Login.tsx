import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function signIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <div className="login-page" >
      <div className="login-glow glow-one" />
      <div className="login-glow glow-two" />

      <div className="login-layout">
        <section className="login-brand-panel">
          <div className="login-brand">
            <div className="brand-mark large"><Wrench size={24} /></div>
            <div>
              <div className="brand-name">TNF Initiative</div>
              <div className="brand-subtitle">Trouble Not Found</div>
            </div>
          </div>

          <div className="login-hero">
            <span className="eyebrow">VEHICLE ISSUE TRACKER</span>
            <h1>Capture the problem.<br /><em>Find the pattern.</em></h1>
            <p>
              A focused workspace for documenting vehicle issues and links to existing issues.
            </p>

            {/*<div className="feature-list">*/}
            {/*  <div><CheckCircle2 size={18} /><span>Structured TNF writeups</span></div>*/}
            {/*  <div><CheckCircle2 size={18} /><span>Photos, videos and diagnostic logs</span></div>*/}
            {/*  <div><CheckCircle2 size={18} /><span>Existing issue traceability</span></div>*/}
            {/*</div>*/}
          </div>

          <div className="login-footnote">Specialized Engineering Assessment Lead (SEAL) Portal</div>
        </section>

        <section className="login-form-panel">
          <div className="login-card">
            <div className="login-card-icon"><ShieldCheck size={22} /></div>
            <div className="eyebrow">SECURE ACCESS</div>
            <h2>Welcome back</h2>
            <p className="login-description">Sign in with your corporate account to continue.</p>

            <form onSubmit={signIn}>
              <button className="sso-button" type="submit" disabled={loading}>
                <span className="sso-logo">M</span>
                <span>{loading ? "Signing you in…" : "Continue with corporate account"}</span>
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="security-note">
              <ShieldCheck size={15} />
              <span>Authentication is handled by your organization’s identity provider.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
