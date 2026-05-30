import React, { useEffect, useState } from "react";
import {
  getProjects, createProject, updateProject, deleteProject,
} from "../utils/api";
import toast from "react-hot-toast";
import "./ProjectsPage.css";

const INITIAL_FORM = {
  title: "", description: "", status: "planning", priority: "medium",
  techStack: "", progress: 0, deadline: "", githubUrl: "", liveUrl: "",
};

const statusBadge = {
  planning: "badge-orange", "in-progress": "badge-blue",
  completed: "badge-green", "on-hold": "badge-red",
};
const priorityBadge = {
  low: "badge-gray", medium: "badge-blue", high: "badge-orange", critical: "badge-red",
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditProject(null);
    setFormData(INITIAL_FORM);
    setShowModal(true);
  };

  const openEdit = (project) => {
    setEditProject(project);
    setFormData({
      title: project.title, description: project.description, status: project.status,
      priority: project.priority, techStack: project.techStack?.join(", ") || "",
      progress: project.progress, deadline: project.deadline?.split("T")[0] || "",
      githubUrl: project.githubUrl || "", liveUrl: project.liveUrl || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()).filter(Boolean),
        progress: Number(formData.progress),
      };
      if (editProject) {
        await updateProject(editProject._id, payload);
        toast.success("Project updated! ✅");
      } else {
        await createProject(payload);
        toast.success("Project created! 🚀");
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>{projects.length} total projects</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>+ New Project</button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {["all", "planning", "in-progress", "completed", "on-hold"].map((f) => (
          <button
            key={f} onClick={() => setFilter(f)}
            className={`filter-tab ${filter === f ? "active" : ""}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="projects-loading">
          <div className="spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-projects">
          <div className="empty-icon">📁</div>
          <h3>No projects found</h3>
          <p>Create your first project to get started</p>
          <button className="btn-primary" onClick={openCreate}>+ Create Project</button>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((project) => (
            <div key={project._id} className="project-card">
              <div className="project-card-header">
                <div className="project-badges">
                  <span className={`badge ${statusBadge[project.status]}`}>{project.status}</span>
                  <span className={`badge ${priorityBadge[project.priority]}`}>{project.priority}</span>
                </div>
                <div className="project-actions">
                  <button className="icon-btn edit" onClick={() => openEdit(project)} title="Edit">✏️</button>
                  <button className="icon-btn delete" onClick={() => handleDelete(project._id)} title="Delete">🗑️</button>
                </div>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc">{project.description}</p>

              {project.techStack?.length > 0 && (
                <div className="tech-stack">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              )}

              <div className="project-progress">
                <div className="progress-label">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="project-footer">
                {project.deadline && (
                  <span className="project-deadline">
                    📅 {new Date(project.deadline).toLocaleDateString()}
                  </span>
                )}
                <div className="project-links">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="link-btn">GitHub</a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="link-btn live">Live</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editProject ? "Edit Project" : "New Project"}</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="project-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Project Title *</label>
                  <input name="title" value={formData.title} onChange={handleChange} placeholder="My Awesome Project" required />
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What is this project about?" rows={3} required />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tech Stack (comma separated)</label>
                <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB, Express" />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Progress: {formData.progress}%</label>
                  <input type="range" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} className="range-input" />
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} />
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>GitHub URL</label>
                  <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
                </div>
                <div className="form-group">
                  <label>Live URL</label>
                  <input name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://myapp.com" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
