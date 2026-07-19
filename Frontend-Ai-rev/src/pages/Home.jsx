function Home({ onLogin, onRegister }) {
  return (
    <div className="home-page">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-mark">
            &lt;/&gt;
          </span>

          CodeReview AI
        </div>

        <div className="nav-buttons">

          <button
            className="nav-login"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            className="nav-register"
            onClick={onRegister}
          >
            Get Started
          </button>

        </div>

      </nav>


      {/* HERO */}

      <main className="hero-section">

        <div className="hero-content">

          <p className="hero-tag">
            AI-POWERED CODE ANALYSIS
          </p>

          <h1>
            Write better Python code.
            <br />

            <span>
              Review smarter.
            </span>
          </h1>

          <p className="hero-description">
            One intelligent workspace for AI feedback,
            code quality analysis, security scanning,
            and maintainability insights.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-button"
              onClick={onRegister}
            >
              Start Reviewing
              <span>→</span>
            </button>

          </div>

          <p className="hero-note">
            Built for developers who want to understand
            and improve their code.
          </p>

        </div>


        {/* PRODUCT PREVIEW */}

        <div className="hero-card">

          <div className="card-header">

            <span className="status-dot"></span>

            <span>
              AI Code Review
            </span>

            <span className="review-status">
              COMPLETE
            </span>

          </div>


          <div className="code-window">

            <div className="code-line">

              <span className="line-number">
                1
              </span>

              <span>
                <span className="keyword">
                  def
                </span>{" "}

                <span className="function">
                  calculate_total
                </span>
                (items):
              </span>

            </div>


            <div className="code-line">

              <span className="line-number">
                2
              </span>

              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;

                <span className="keyword">
                  return
                </span>{" "}

                sum(items)
              </span>

            </div>

          </div>


          <div className="review-results">

            <div className="review-message success">

              <span>
                ✓
              </span>

              <div>

                <strong>
                  Code looks good
                </strong>

                <small>
                  AI Review
                </small>

              </div>

            </div>


            <div className="review-message warning">

              <span>
                !
              </span>

              <div>

                <strong>
                  Missing function docstring
                </strong>

                <small>
                  Pylint · C0116
                </small>

              </div>

            </div>

          </div>


          <div className="preview-score">

            <div>

              <span>
                REVIEW SCORE
              </span>

              <strong>
                8.6
              </strong>

            </div>

            <div className="score-label">
              GOOD
            </div>

          </div>

        </div>

      </main>


      {/* FEATURES */}

      <section className="features-section">

        <div className="section-heading">

          <p>
            ONE COMPLETE CODE REVIEW
          </p>

          <h2>
            Everything your Python code needs.
          </h2>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-number">
              01
            </div>

            <h3>
              AI Review
            </h3>

            <p>
              Understand your code with beginner-friendly
              explanations and actionable suggestions.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              02
            </div>

            <h3>
              Static Analysis
            </h3>

            <p>
              Detect code quality issues and bad practices
              with professional Pylint analysis.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              03
            </div>

            <h3>
              Security Scan
            </h3>

            <p>
              Identify common Python security issues
              using Bandit analysis.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-number">
              04
            </div>

            <h3>
              Code Quality
            </h3>

            <p>
              Measure maintainability and complexity
              with Radon metrics.
            </p>

          </div>

        </div>

      </section>


      {/* WORKFLOW */}

      <section className="workflow-section">

        <div className="section-heading">

          <p>
            HOW IT WORKS
          </p>

          <h2>
            From code to clarity.
          </h2>

        </div>


        <div className="workflow">

          <div className="workflow-step">

            <span>
              01
            </span>

            <h3>
              Upload
            </h3>

            <p>
              Upload your Python file to your project.
            </p>

          </div>


          <div className="workflow-line"></div>


          <div className="workflow-step">

            <span>
              02
            </span>

            <h3>
              Analyze
            </h3>

            <p>
              Multiple analysis tools inspect your code.
            </p>

          </div>


          <div className="workflow-line"></div>


          <div className="workflow-step">

            <span>
              03
            </span>

            <h3>
              Improve
            </h3>

            <p>
              Understand your code and make it better.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;