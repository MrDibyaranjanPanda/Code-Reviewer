import { useEffect, useState } from "react";
import { getReview } from "../services/api";

function ReviewResults({ file, onBack }) {
  const [review, setReview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const response = await getReview(file.id);

      setReview(response.data.review);

    } catch (error) {
      setError(
        error.response?.data?.error ||
        "Failed to load review"
      );
    }
  };

  const pylintCount = review?.pylint?.length || 0;

  const banditIssues =
    review?.bandit?.results?.length || 0;

  const maintainability =
    review?.radon?.maintainability;

  return (
    <div>
      <button onClick={onBack}>
        ← Back to Project
      </button>

      <h1>Review Results</h1>

      <h2>{file.filename}</h2>

      {error && <p>{error}</p>}

      {!review && !error && (
        <p>Loading review...</p>
      )}

      {review && (
        <div>
          <hr />

          <h2>AI Code Review</h2>

          <p>
            {review.ai_review}
          </p>

          <hr />

          <h2>Code Analysis Summary</h2>

          <p>
            <strong>Pylint Issues:</strong>{" "}
            {pylintCount}
          </p>

          <p>
            <strong>Security Issues:</strong>{" "}
            {banditIssues}
          </p>

          <p>
            <strong>Maintainability:</strong>{" "}
            {Object.values(maintainability)[0].rank}
          </p>

          <hr />

          <h2>Pylint Results</h2>

          {pylintCount === 0 ? (
            <p>No Pylint issues found.</p>
          ) : (
            review.pylint.map((issue, index) => (
              <div key={index}>
                <p>
                  <strong>{issue.symbol}</strong>
                </p>

                <p>
                  {issue.message}
                </p>

                <p>
                  Line: {issue.line}
                </p>

                <hr />
              </div>
            ))
          )}

          <h2>Bandit Security Results</h2>

          {banditIssues === 0 ? (
            <p>
              No security issues found.
            </p>
          ) : (
            review.bandit.results.map(
              (issue, index) => (
                <div key={index}>
                  <p>
                    {issue.issue_text}
                  </p>

                  <p>
                    Severity:{" "}
                    {issue.issue_severity}
                  </p>

                  <hr />
                </div>
              )
            )
          )}

          <h2>Radon Code Quality</h2>

          <p>
            Maintainability Index:{" "}
            {Object.values(maintainability)[0].mi.toFixed(2)}
          </p>

          <p>
            Maintainability Rank:{" "}
            {Object.values(maintainability)[0].rank}
          </p>

          <h3>Complexity</h3>

          {Object.values(
            review.radon.complexity
          )[0].map((item, index) => (
            <div key={index}>
              <p>
                Function: {item.name}
              </p>

              <p>
                Complexity: {item.complexity}
              </p>

              <p>
                Rank: {item.rank}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewResults;