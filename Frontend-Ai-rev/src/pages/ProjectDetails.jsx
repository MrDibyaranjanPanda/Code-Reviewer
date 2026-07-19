import { useEffect, useState } from "react";
import {
  getProjectFiles,
  uploadFile,
} from "../services/api";

function ProjectDetails({
  project,
  onBack,
  onReviewSelect,
}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await getProjectFiles(project.id);

      setFiles(response.data);

    } catch (error) {
      setError(
        error.response?.data?.error ||
        "Failed to load project files"
      );
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a Python file");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      await uploadFile(project.id, formData);

      setSelectedFile(null);

      document
        .getElementById("file-input")
        .value = "";

      await loadFiles();

    } catch (error) {
      setError(
        error.response?.data?.error ||
        "File upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <button onClick={onBack}>
        ← Back to Dashboard
      </button>

      <h1>{project.project_name}</h1>

      <p>
        Upload type: {project.upload_type}
      </p>

      <h2>Upload Python File</h2>

      <form onSubmit={handleUpload}>
        <input
          id="file-input"
          type="file"
          accept=".py"
          onChange={(event) =>
            setSelectedFile(event.target.files[0])
          }
        />

        <button
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Reviewing..."
            : "Upload & Review"}
        </button>
      </form>

      <h2>Project Files</h2>

      {error && <p>{error}</p>}

      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        files.map((file) => (
          <div key={file.id}>
            <h4>
              <button
                onClick={() => onReviewSelect(file)}
              >
                {file.filename}
              </button>
            </h4>

            <p>
              Uploaded at: {file.uploaded_at}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectDetails;