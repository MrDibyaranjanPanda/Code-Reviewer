import { useEffect, useState } from "react";

import {
  getProjectFiles,
  uploadFile,
  deleteFile,
} from "../services/api";


function Project({
  project,
  onBack,
  onOpenReview,
}) {

  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState(null);

  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);


  useEffect(() => {
    loadFiles();
  }, []);


  const loadFiles = async () => {

    try {

      const response = await getProjectFiles(
        project.id
      );

      setFiles(response.data.files || []);
      setError("");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.error ||
        "Failed to load project files"
      );

    } finally {

      setLoading(false);

    }

  };


  const handleFileChange = (event) => {

    setSelectedFile(
      event.target.files[0]
    );

    setUploadMessage("");
    setError("");

  };


  const handleUpload = async (event) => {

    event.preventDefault();


    if (!selectedFile) {

      setError(
        "Please select a Python file"
      );

      return;

    }


    try {

      setUploading(true);

      setError("");
      setUploadMessage("");


      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );


      await uploadFile(
        project.id,
        formData
      );


      setSelectedFile(null);


      const fileInput = document.getElementById(
        "python-file-input"
      );

      if (fileInput) {
        fileInput.value = "";
      }


      setUploadMessage(
        "File uploaded and reviewed successfully!"
      );


      await loadFiles();


    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.error ||
        "Failed to upload file"
      );

    } finally {

      setUploading(false);

    }

  };


  const handleDeleteFile = async (file) => {

    const confirmed = window.confirm(
      `Are you sure you want to delete ${file.filename}?`
    );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingFileId(file.id);
      setError("");


      await deleteFile(file.id);


      await loadFiles();


    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.error ||
        "Failed to delete file"
      );

    } finally {

      setDeletingFileId(null);

    }

  };


  return (

    <div className="project-page">


      {/* HEADER */}

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Back to Dashboard
      </button>


      <div className="project-header">

        <div>

          <p className="section-label">
            PROJECT
          </p>


          <h1>
            {project.project_name}
          </h1>


          <p className="project-type">
            Python project · {project.upload_type}
          </p>

        </div>


        <div className="project-badge">
          PY
        </div>

      </div>


      {/* UPLOAD SECTION */}

      <section className="upload-section">

        <div>

          <p className="section-label">
            CODE ANALYSIS
          </p>


          <h2>
            Upload Python File
          </h2>


          <p>
            Upload a Python file and get an AI-powered code review.
          </p>

        </div>


        <form
          className="upload-form"
          onSubmit={handleUpload}
        >

          <input
            id="python-file-input"
            type="file"
            accept=".py"
            onChange={handleFileChange}
          />


          <button
            type="submit"
            className="upload-button"
            disabled={uploading}
          >

            {uploading
              ? "Analyzing..."
              : "Upload & Review"
            }

          </button>

        </form>

      </section>


      {/* ERROR MESSAGE */}

      {error && (

        <div className="error-state">
          {error}
        </div>

      )}


      {/* SUCCESS MESSAGE */}

      {uploadMessage && (

        <div className="success-state">
          {uploadMessage}
        </div>

      )}


      {/* FILES SECTION */}

      <section className="files-section">


        <div className="section-heading">

          <div>

            <p className="section-label">
              CODE FILES
            </p>


            <h2>
              Uploaded files
            </h2>

          </div>


          <span className="file-count">

            {files.length} file
            {files.length !== 1 ? "s" : ""}

          </span>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="empty-state">
            Loading files...
          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          !error &&
          files.length === 0 && (

            <div className="empty-state">

              <h3>
                No files uploaded yet
              </h3>


              <p>
                Upload your first Python file to start reviewing code.
              </p>

            </div>

          )}


        {/* FILE LIST */}

        {!loading &&
          files.length > 0 && (

            <div className="files-list">


              {files.map((file) => (

                <div
                  className="file-card"
                  key={file.id}
                >


                  <div className="file-info">


                    <div className="file-icon">
                      PY
                    </div>


                    <div>

                      <h3>
                        {file.filename}
                      </h3>


                      <p>

                        Uploaded at:{" "}

                        {new Date(
                          file.uploaded_at
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>


                  <div className="file-actions">


                    <button
                      className="review-button"
                      onClick={() =>
                        onOpenReview(file)
                      }
                    >
                      View Review →
                    </button>


                    <button
                      className="delete-file-button"
                      onClick={() =>
                        handleDeleteFile(file)
                      }
                      disabled={
                        deletingFileId === file.id
                      }
                    >

                      {deletingFileId === file.id
                        ? "Deleting..."
                        : "Delete"
                      }

                    </button>

                  </div>


                </div>

              ))}


            </div>

          )}


      </section>


    </div>

  );

}


export default Project;