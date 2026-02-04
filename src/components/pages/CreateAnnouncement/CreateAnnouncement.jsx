import React, { useState } from "react";
import api from "../../../API/axios";
import "./CreateAnnouncement.css";

const CreateAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post(
        "/api/captain/announcements/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Announcement created successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
    } catch (err) {
      console.error("Failed to create announcement:", err);
      setError("Failed to create announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-announcement-container">
      <h2>Create New Announcement</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image (optional)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Announcement"}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
