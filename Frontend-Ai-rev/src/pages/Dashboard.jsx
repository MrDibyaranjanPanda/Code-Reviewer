import { useEffect, useState } from "react";

import {
  getProjects,
  createProject,
  getDashboardStats,
  getProfile,
  deleteProject,
} from "../services/api";


function Dashboard({
  onLogout,
  onOpenProject,
  onOpenReviews,
}) {

  const [projects, setProjects] = useState([]);

  const [stats, setStats] = useState({
    total_projects: 0,
    total_reviews: 0,
    total_issues: 0,
  });

  const [user, setUser] = useState(null);

  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [projectName, setProjectName] = useState("");

  const [uploadType, setUploadType] = useState("file");


  useEffect(() => {

    loadDashboard();

  }, []);


  const loadDashboard = async () => {

    try {

      const [
        projectsResponse,
        statsResponse,
        profileResponse,
      ] = await Promise.all([

        getProjects(),

        getDashboardStats(),

        getProfile(),

      ]);


      setProjects(
        projectsResponse.data
      );


      setStats(
        statsResponse.data
      );


      setUser(
        profileResponse.data
      );


      setError("");


    } catch (error) {

      console.error(error);


      setError(

        error.response?.data?.error ||

        "Failed to load dashboard"

      );

    }

  };


  const handleCreateProject = async (event) => {

    event.preventDefault();


    if (!projectName.trim()) {

      setError(
        "Project name is required"
      );

      return;

    }


    try {

      await createProject({

        project_name: projectName,

        upload_type: uploadType,

      });


      setProjectName("");

      setUploadType("file");

      setShowForm(false);


      await loadDashboard();


    } catch (error) {

      setError(

        error.response?.data?.error ||

        "Failed to create project"

      );

    }

  };


  const handleDeleteProject = async (project) => {

    const confirmed = window.confirm(

      `Are you sure you want to delete "${project.project_name}"?`

    );


    if (!confirmed) {

      return;

    }


    try {

      setDeletingProjectId(project.id);

      setError("");


      await deleteProject(project.id);


      await loadDashboard();


    } catch (error) {

      console.error(error);


      setError(

        error.response?.data?.error ||

        "Failed to delete project"

      );

    } finally {

      setDeletingProjectId(null);

    }

  };


  return (

    <div className="dashboard-layout">


      {/* SIDEBAR */}

      <aside className="sidebar">


        <div className="sidebar-logo">

          <span>
            &lt;/&gt;
          </span>

          CodeReview AI

        </div>


        <nav className="sidebar-nav">


          <button
            className="sidebar-link active"
          >

            <span>
              ▦
            </span>

            Dashboard

          </button>


          <button
            className="sidebar-link"
            onClick={onOpenReviews}
          >

            <span>
              ◈
            </span>

            Reviews

          </button>


        </nav>


        <div className="sidebar-bottom">


          <button
            className="sidebar-link logout-link"
            onClick={onLogout}
          >

            <span>
              ↪
            </span>

            Logout

          </button>


        </div>


      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">


          <div>

            <p className="dashboard-label">
              WORKSPACE
            </p>


            <h1>
              Dashboard
            </h1>

          </div>


          <div className="user-profile">


            <div className="user-avatar">

              {user?.name

                ? user.name.charAt(0).toUpperCase()

                : "U"

              }

            </div>


            <div>

              <strong>

                {user?.name || "User"}

              </strong>

            </div>


          </div>


        </header>


        {/* WELCOME */}

        <section className="dashboard-welcome">


          <div>

            <p className="welcome-label">
              AI CODE ANALYSIS
            </p>


            <h2>
              Build better code.
            </h2>


            <p>

              Upload your Python projects and get
              intelligent code reviews.

            </p>

          </div>


          <button

            className="dashboard-create-button"

            onClick={() =>
              setShowForm(true)
            }

          >

            + Create Project

          </button>


        </section>


        {/* ERROR */}

        {error && (

          <p className="dashboard-error">
            {error}
          </p>

        )}


        {/* STATS */}

        <section className="stats-grid">


          <div className="stat-card">


            <span className="stat-label">
              TOTAL PROJECTS
            </span>


            <strong>
              {stats.total_projects}
            </strong>


            <small>
              Your projects
            </small>


          </div>


          <div className="stat-card">


            <span className="stat-label">
              CODE REVIEWS
            </span>


            <strong>
              {stats.total_reviews}
            </strong>


            <small>
              Reviews completed
            </small>


          </div>


          <div className="stat-card">


            <span className="stat-label">
              ISSUES FOUND
            </span>


            <strong>
              {stats.total_issues}
            </strong>


            <small>
              Across all projects
            </small>


          </div>


        </section>


        {/* PROJECTS */}

        <section className="projects-section">


          <div className="section-title-row">


            <div>

              <p className="dashboard-label">
                WORKSPACE
              </p>


              <h2>
                Your Projects
              </h2>

            </div>


            <span className="project-count">

              {projects.length} projects

            </span>


          </div>


          {projects.length === 0 ? (


            <div className="empty-projects">


              <div className="empty-icon">
                +
              </div>


              <h3>
                No projects yet
              </h3>


              <p>

                Create your first project to start
                reviewing Python code.

              </p>


              <button

                onClick={() =>
                  setShowForm(true)
                }

              >

                Create Project

              </button>


            </div>


          ) : (


            <div className="project-grid">


              {projects.map((project) => (


                <div

                  className="project-card"

                  key={project.id}

                >


                  <div className="project-card-top">


                    <div className="project-icon">
                      PY
                    </div>


                    <button

                      className="project-menu"

                      title="Delete Project"

                      onClick={() =>
                        handleDeleteProject(project)
                      }

                      disabled={

                        deletingProjectId === project.id

                      }

                    >

                      {deletingProjectId === project.id

                        ? "..."

                        : "🗑️"

                      }

                    </button>


                  </div>


                  <h3>
                    {project.project_name}
                  </h3>


                  <p>
                    Python project
                  </p>


                  <div className="project-card-bottom">


                    <span>
                      {project.upload_type}
                    </span>


                    <button

                      onClick={() =>
                        onOpenProject(project)
                      }

                    >

                      Open →

                    </button>


                  </div>


                </div>


              ))}


            </div>

          )}


        </section>


        {/* CREATE PROJECT MODAL */}

        {showForm && (


          <div className="modal-overlay">


            <div className="project-modal">


              <div className="modal-header">


                <div>


                  <p className="dashboard-label">
                    NEW PROJECT
                  </p>


                  <h2>
                    Create Project
                  </h2>


                </div>


                <button

                  className="modal-close"

                  onClick={() =>
                    setShowForm(false)
                  }

                >

                  ×

                </button>


              </div>


              <form

                onSubmit={handleCreateProject}

              >


                <label>
                  Project Name
                </label>


                <input

                  type="text"

                  placeholder="e.g. My Python Project"

                  value={projectName}

                  onChange={(event) =>
                    setProjectName(
                      event.target.value
                    )
                  }

                />


                <label>
                  Upload Type
                </label>


                <select

                  value={uploadType}

                  onChange={(event) =>
                    setUploadType(
                      event.target.value
                    )
                  }

                >

                  <option value="file">
                    Python File
                  </option>


                  <option value="project">
                    Python Project
                  </option>


                </select>


                <button

                  className="modal-submit"

                  type="submit"

                >

                  Create Project

                </button>


              </form>


            </div>


          </div>

        )}


      </main>


    </div>

  );

}


export default Dashboard;