

import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";


/* ============================================================
    DARK MODE THEME HANDLER */
function useDarkMode() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark];
}



/* ========
    LANDING PAGE WITH SLIDESHOW + ANIMATIONS
 */
function Home() {
  const slides = [
    {
      title: "Track Every Opportunity",
      text: "A single dashboard to manage all your applications professionally.",
    },
    {
      title: "Stay Organized",
      text: "Quick filtering, clean visual layout, instant status updates.",
    },
    {
      title: "Secure by Design",
      text: "JWT authentication, hashed passwords, protected routes.",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((n) => (n + 1) % slides.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <div className="fade-in landing-page">
      <header className="landing-hero">
        <h1 className="landing-title">
          Your Job Search,
          <span className="gradient"> Simplified.</span>
        </h1>
        <p className="landing-subtitle">
          Track applications, update progress, visualize your career journey.
        </p>

        <div className="landing-buttons">
          <Link to="/register">
            <button className="btn-primary big">Get Started</button>
          </Link>
          <Link to="/login">
            <button className="btn-secondary big">Login</button>
          </Link>
        </div>
      </header>

      <section className="slide-card fade-in">
        <h3 className="slide-title">{slide.title}</h3>
        <p className="slide-text">{slide.text}</p>
      </section>
    </div>
  );
}



/* ============================================================
    LOGIN PAGE */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMsg(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        setMsg("Success! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 600);
      }
    } catch {
      setMsg("Network error.");
    }
  };

  return (
    <div className="center-page fade-in">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={submit} className="form">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />

          <button className="btn-primary">Login</button>
        </form>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}



/* ====
    REGISTER PAGE
   ======== */
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (pw !== cpw) return setMsg("Passwords do not match");

    setMsg("Sending...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pw }),
      });

      const data = await res.json();
      if (!res.ok) setMsg(data.message);
      else setMsg("Account created!");
    } catch {
      setMsg("Network error.");
    }
  };

  return (
    <div className="center-page fade-in">
      <div className="auth-card">
        <h2>Create an Account</h2>

        <form className="form" onSubmit={submit}>
          <input
            className="input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="input"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            type="password"
          />
          <input
            className="input"
            placeholder="Confirm Password"
            value={cpw}
            onChange={(e) => setCpw(e.target.value)}
            type="password"
          />

          <button className="btn-primary">Register</button>
        </form>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}



/* ============================================================
    KANBAN BOARD PAGE
   ============================================================ */
function Kanban() {
  return (
    <div className="card fade-in">
      <h2>Board</h2>
      <p style={{ opacity: 0.7 }}>
        (Static layout — demonstration of UI component)
      </p>

      <div className="kanban-grid">
        <div className="kanban-col">
          <h4>Applied</h4>
          <div className="kanban-item">Google – SWE Intern</div>
          <div className="kanban-item">Deloitte – Analyst</div>
        </div>

        <div className="kanban-col">
          <h4>Interview</h4>
          <div className="kanban-item">Microsoft – Junior Developer</div>
        </div>

        <div className="kanban-col">
          <h4>Offer</h4>
          <div className="kanban-item">StartupX – Frontend Developer</div>
        </div>

        <div className="kanban-col">
          <h4>Rejected</h4>
          <div className="kanban-item">Cognizant – GenC</div>
        </div>
      </div>
    </div>
  );
}



/* ============================================================
    TIMELINE PAGE
   ============================================================ */
function Timeline() {
  return (
    <div className="card fade-in">
      <h2>Your Journey Timeline</h2>

      <div className="timeline">
        <div className="timeline-item">
          <div className="dot"></div>
          <div className="timeline-content">
            <h4>Applied to Google</h4>
            <p>Jan 4th, 2025</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="dot"></div>
          <div className="timeline-content">
            <h4>Interview at Microsoft</h4>
            <p>Jan 10th, 2025</p>
          </div>
        </div>

        <div className="timeline-item">
          <div className="dot"></div>
          <div className="timeline-content">
            <h4>Offer from StartupX</h4>
            <p>Jan 22nd, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ============================================================
    RESOURCES PAGE
   ============================================================ */
function Resources() {
  return (
    <div className="card fade-in">
      <h2>Resources & Guides</h2>

      <ul className="resource-list">
        <li>
          <a href="https://leetcode.com" target="_blank">
            LeetCode – DSA Prep
          </a>
        </li>
        <li>
          <a href="https://interviewing.io" target="_blank">
            Interviewing.io – Mock Interviews
          </a>
        </li>
        <li>
          <a href="https://github.com" target="_blank">
            GitHub – Projects & Portfolio
          </a>
        </li>
      </ul>
    </div>
  );
}

/* ============================================================
    PROFILE PAGE (NAME, QUALIFICATION, EDUCATION, RESUME, ETC.)
   ============================================================ */
function Profile() {
  const [fullName, setFullName] = useState("");
  const [qualification, setQualification] = useState("");
  const [education, setEducation] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [skills, setSkills] = useState("");
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setMessage("Profile saved locally (front-end only).");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="card fade-in">
      <h2 className="section-title">Profile</h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
        Keep your career details here for quick reference during your job search.
      </p>

      <form className="form" onSubmit={handleSave}>
        <input
          className="input"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Highest Qualification (e.g. B.Tech CSE - AI)"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
        />

        <input
          className="input"
          placeholder="Education (e.g. College / University)"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        <input
          className="input"
          placeholder="Resume Link (Google Drive / portfolio URL)"
          value={resumeLink}
          onChange={(e) => setResumeLink(e.target.value)}
        />

        <input
          className="input"
          placeholder="Skills (comma separated e.g. React, Node, ML)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <textarea
          className="textarea"
          placeholder="Short summary about you, goals, preferred roles..."
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <button className="btn-primary" type="submit">
          Save Profile
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}


/* ============================================================
    DASHBOARD (COLOURFUL SUMMARY)
   ============================================================ */
function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/applications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const s = {
          total: data.length,
          applied: data.filter((a) => a.status === "Applied").length,
          interview: data.filter((a) => a.status === "Interview").length,
          offer: data.filter((a) => a.status === "Offer").length,
          rejected: data.filter((a) => a.status === "Rejected").length,
        };
        setStats(s);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard-page fade-in">
      <div className="card dashboard-hero">
        <h2 className="dashboard-title">
          Welcome back 👋
        </h2>
        <p className="dashboard-subtitle">
          Here’s a quick summary of your job applications. Use the buttons
          below to jump to different views.
        </p>
        <div className="dashboard-quick-links">
          <Link to="/kanban">
            <button className="chip chip-blue">Kanban Board</button>
          </Link>
          <Link to="/timeline">
            <button className="chip chip-purple">Timeline</button>
          </Link>
          <Link to="/profile">
            <button className="chip chip-green">Profile</button>
          </Link>
          <Link to="/resources">
            <button className="chip chip-gold">Resources</button>
          </Link>
        </div>
      </div>

      <div className="card dashboard-stats-card">
        <h3 className="section-title">Application Snapshot</h3>
        <div className="stats-grid">
          <div className="stat-card colorful total">
            <div className="stat-label">Total</div>
            <div className="stat-value">{stats.total}</div>
          </div>
          <div className="stat-card colorful applied">
            <div className="stat-label">Applied</div>
            <div className="stat-value">{stats.applied}</div>
          </div>
          <div className="stat-card colorful interview">
            <div className="stat-label">Interview</div>
            <div className="stat-value">{stats.interview}</div>
          </div>
          <div className="stat-card colorful offer">
            <div className="stat-label">Offers</div>
            <div className="stat-value">{stats.offer}</div>
          </div>
          <div className="stat-card colorful rejected">
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{stats.rejected}</div>
          </div>
        </div>
      </div>
    </div>
  );
}



/* ============================================================
   MAIN APP SHELL WITH PREMIUM SIDEBAR + DARK MODE
   ============================================================ */
function AppShell() {
  const [dark, setDark] = useDarkMode();
  const isLoggedIn = !!localStorage.getItem("token");
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      {/* SIDEBAR ====================================================== */}
      <aside className={`sidebar ${open ? "" : "collapsed"}`}>
        <button className="collapse-btn" onClick={() => setOpen(!open)}>
          {open ? "⮜" : "⮞"}
        </button>
      <aside className={`sidebar ${open ? "" : "collapsed"}`}>
        <button className="collapse-btn" onClick={() => setOpen(!open)}>
          {open ? "⮜" : "⮞"}
        </button>

        <nav>
          <Link to="/" className="side-item">
            <span className="icon">🏠</span>
            {open && <span>Home</span>}
          </Link>

          <Link to="/dashboard" className="side-item">
            <span className="icon">📊</span>
            {open && <span>Dashboard</span>}
          </Link>

          <Link to="/profile" className="side-item">
            <span className="icon">👤</span>
            {open && <span>Profile</span>}
          </Link>

          <Link to="/kanban" className="side-item">
            <span className="icon">📁</span>
            {open && <span>Kanban Board</span>}
          </Link>

          <Link to="/timeline" className="side-item">
            <span className="icon">🕒</span>
            {open && <span>Timeline</span>}
          </Link>

          <Link to="/resources" className="side-item">
            <span className="icon">📚</span>
            {open && <span>Resources</span>}
          </Link>
        </nav>
      </aside>

         </aside>

      {/* NAVBAR ======================================================== */}
      <header className="topbar">
        <div className="title">JobTrackr</div>

        <div className="actions">
          <button className="dark-toggle" onClick={() => setDark(!dark)}>
            {dark ? "🌙" : "☀️"}
          </button>

          {isLoggedIn ? (
            <button className="btn-secondary" onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button className="btn-secondary">Login</button>
              </Link>
              <Link to="/register">
                <button className="btn-primary">Register</button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* PAGE CONTENT ================================================== */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/timeline" element={<Timeline />} />
         
                   <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/kanban" element={<Kanban />} />
 <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
    </div>
  );
}



/* ============================================================
    EXPORT
   ============================================================ */
export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
