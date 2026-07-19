import { useEffect, useState } from "react";

import {
  getReview,
  downloadReviewPdf,
} from "../services/api";

function Review({
  file,
  onBack,
}) {
  const [review, setReview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const response = await getReview(file.id);

      setReview(response.data.review);
      setError("");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
        "Failed to load review"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">

      {/* BACK BUTTON */}

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Project
      </button>


      {/* HEADER */}

      <div className="review-header">

        <p className="section-label">
          CODE REVIEW
        </p>

        <h1>
          {file.filename}
        </h1>

        <p>
          AI-powered analysis results
        </p>

        <button
  className="download-pdf-button"
  onClick={async () => {

    try {

      const response = await downloadReviewPdf(file.id);

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `code_review_${file.id}.pdf`
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

      alert("Failed to download PDF");

    }

  }}
>
  📄 Download PDF
</button>

      </div>


      {/* LOADING */}

      {loading && (
        <div className="empty-state">
          Loading review...
        </div>
      )}


      {/* ERROR */}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}


      {/* REVIEW RESULTS */}

      {review && (

        <div className="review-results">


          {/* AI REVIEW */}

          <section className="review-card">

            <div className="review-card-header">

              <h2>
                🤖 AI Code Review
              </h2>

            </div>


            <div className="ai-review-content">


              {/* SUMMARY */}

              <div className="ai-section">

                <h3>
                  📌 Summary
                </h3>

                <p>
                  {review.ai_review?.summary}
                </p>

              </div>


              {/* WHAT CODE DOES */}

              <div className="ai-section">

                <h3>
                  🔍 What the Code Does
                </h3>

                <p>
                  {review.ai_review?.what_code_does}
                </p>

              </div>


              {/* ISSUES */}

              <div className="ai-section">

                <h3>
                  ⚠️ Issues
                </h3>

                <p>
                  {review.ai_review?.issues}
                </p>

              </div>


              {/* BEST PRACTICES */}

              <div className="ai-section">

                <h3>
                  💡 Best Practices
                </h3>

                <p>
                  {review.ai_review?.best_practices}
                </p>

              </div>


              {/* IMPROVED CODE */}

              <div className="ai-section">

                <h3>
                  ✨ Improved Code
                </h3>

                <pre className="code-block">
                  {review.ai_review?.improved_code}
                </pre>

              </div>

            </div>

          </section>


          {/* SUMMARY CARDS */}

          <section className="review-summary">

            <div className="summary-card">

              <span>
                SCORE
              </span>

              <strong>
                {review.ai_review?.score ?? "—"}
              </strong>

            </div>


            <div className="summary-card">

              <span>
                SEVERITY
              </span>

              <strong>
                {review.ai_review?.severity || "—"}
              </strong>

            </div>


            <div className="summary-card">

              <span>
                PYLINT ISSUES
              </span>

              <strong>
                {review.pylint?.length || 0}
              </strong>

            </div>

          </section>


          {/* PYLINT */}

          <section className="review-card">

            <h2>
              🔍 Pylint Results
            </h2>


            {review.pylint?.length === 0 ? (

              <p className="clean-result">
                ✓ No Pylint issues found
              </p>

            ) : (

              <div className="issue-list">

                {review.pylint.map((issue, index) => (

                  <div
                    className="issue-item"
                    key={index}
                  >

                    <strong>
                      {issue.symbol}
                    </strong>

                    <p>
                      {issue.message}
                    </p>

                    <small>
                      Line: {issue.line}
                    </small>

                  </div>

                ))}

              </div>

            )}

          </section>


          {/* BANDIT */}

          <section className="review-card">

            <h2>
              🛡️ Bandit Security Results
            </h2>


            {review.bandit?.results?.length === 0 ? (

              <p className="clean-result">
                ✓ No security issues found
              </p>

            ) : (

              <div className="issue-list">

                {review.bandit.results.map(
                  (issue, index) => (

                    <div
                      className="issue-item"
                      key={index}
                    >

                      <strong>
                        {issue.test_name}
                      </strong>

                      <p>
                        {issue.issue_text}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* RADON */}

          <section className="review-card">

            <h2>
              📊 Radon Code Quality
            </h2>


            <p>

              Maintainability Index:{" "}

              <strong>
                {
                  Object.values(
                    review.radon?.maintainability || {}
                  )[0]?.mi?.toFixed(2) || "—"
                }
              </strong>

            </p>


            <p>

              Maintainability Rank:{" "}

              <strong>
                {
                  Object.values(
                    review.radon?.maintainability || {}
                  )[0]?.rank || "—"
                }
              </strong>

            </p>

          </section>


        </div>

      )}

    </div>
  );
}

export default Review;