import { useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Project from "./pages/Project";
import Review from "./pages/Review";
import Reviews from "./pages/Reviews";


function App() {

  const [currentPage, setCurrentPage] = useState("home");


  const [selectedProject, setSelectedProject] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [reviewOrigin, setReviewOrigin] = useState("project");


  const handleLogout = () => {

    localStorage.removeItem("access_token");

    setSelectedProject(null);

    setSelectedFile(null);

    setCurrentPage("home");

  };


  const handleOpenProject = (project) => {

    setSelectedProject(project);

    setCurrentPage("project");

  };


  const handleOpenReview = (file, origin) => {

  setSelectedFile(file);

  setReviewOrigin(origin);

  setCurrentPage("review");

};


  return (

    <>


      {/* HOME */}

      {currentPage === "home" && (

        <Home

          onLogin={() =>
            setCurrentPage("login")
          }

          onRegister={() =>
            setCurrentPage("register")
          }

        />

      )}


      {/* LOGIN */}

      {currentPage === "login" && (

        <Login
  onHome={() =>
    setCurrentPage("home")
  }

  onSwitchToRegister={() =>
    setCurrentPage("register")
  }

  onLoginSuccess={() =>
    setCurrentPage("dashboard")
  }
/>

      )}


      {/* REGISTER */}

      {currentPage === "register" && (

        <Register
  onHome={() =>
    setCurrentPage("home")
  }

  onSwitchToLogin={() =>
    setCurrentPage("login")
  }
/>

      )}


      {/* DASHBOARD */}

      {currentPage === "dashboard" && (

        <Dashboard

          onLogout={handleLogout}

          onHome={() =>
            setCurrentPage("home")
          }

          onOpenProject={handleOpenProject}

          onOpenReviews={() =>
            setCurrentPage("reviews")
          }

        />

      )}


      {/* PROJECT */}

      {currentPage === "project" && selectedProject && (

        <Project

          project={selectedProject}

          onBack={() =>
            setCurrentPage("dashboard")
          }

          onOpenReview={(file) =>
            handleOpenReview(file, "project")
          }

        />

      )}


      {/* SINGLE REVIEW */}

      {currentPage === "review" && selectedFile && (

        <Review
          file={selectedFile}
          onBack={() =>
            setCurrentPage(reviewOrigin)
          }
        />

      )}


      {/* ALL REVIEWS */}

      {currentPage === "reviews" && (

        <Reviews

          onBack={() =>
            setCurrentPage("dashboard")
          }

          onOpenReview={(file) =>
            handleOpenReview(file, "reviews")
          }

        />

      )}


    </>

  );

}


export default App;