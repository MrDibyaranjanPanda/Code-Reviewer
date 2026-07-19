import { useEffect, useState } from "react";
import { getReviews } from "../services/api";

function Reviews({ onBack, onOpenReview }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await getReviews();

      setReviews(response.data);
      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
        "Failed to load reviews"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>

      <div className="review-header">
        <p className="section-label">
          REVIEW HISTORY
        </p>

        <h1>All Reviews</h1>

        <p>
          Browse every AI review you've generated.
        </p>
      </div>

      {loading && (
        <div className="empty-state">
          Loading...
        </div>
      )}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        reviews.length === 0 && (
          <div className="empty-state">
            No reviews found.
          </div>
        )}

      {!loading &&
        reviews.length > 0 && (
          <div className="files-list">

            {reviews.map((review) => (

              <div
                key={review.review_id}
                className="file-card"
              >

                <div className="file-info">

                  <div className="file-icon">
                    PY
                  </div>

                  <div>

                    <h3>
                      {review.filename}
                    </h3>

                    <p>
                      {review.project_name}
                    </p>

                    <small>
                      Score: {review.score ?? "—"}
                    </small>

                  </div>

                </div>

                <button
                  className="review-button"
                  onClick={() =>
                    onOpenReview({
                      id: review.uploaded_file_id,
                      filename: review.filename,
                    })
                  }
                >
                  Open →
                </button>

              </div>

            ))}

          </div>
        )}

    </div>
  );
}

export default Reviews;