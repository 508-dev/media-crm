import {
  MEDIA_STATUSES,
  MEDIA_TYPES,
  type MediaItemCreate,
} from "@media-crm/shared";
import { useState } from "react";
import { MediaList } from "./components/MediaList";
import { trpc } from "./trpc";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<MediaItemCreate>({
    title: "",
    type: "book",
    status: "want_to_consume",
    rating: null,
    notes: null,
    completedAt: null,
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.media.create.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      setShowForm(false);
      setFormData({
        title: "",
        type: "book",
        status: "want_to_consume",
        rating: null,
        notes: null,
        completedAt: null,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ margin: 0 }}>Media CRM</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          {showForm ? "Cancel" : "Add Media"}
        </button>
      </header>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: 15 }}>
            <label
              htmlFor="title"
              style={{ display: "block", marginBottom: 5 }}
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label htmlFor="type" style={{ display: "block", marginBottom: 5 }}>
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as MediaItemCreate["type"],
                })
              }
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            >
              {MEDIA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              htmlFor="status"
              style={{ display: "block", marginBottom: 5 }}
            >
              Status
            </label>
            <select
              value={formData.status}
              id="status"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as MediaItemCreate["status"],
                })
              }
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            >
              {MEDIA_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              htmlFor="rating"
              style={{ display: "block", marginBottom: 5 }}
            >
              Rating (0-10)
            </label>
            <input
              id="rating"
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={formData.rating ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  rating: e.target.value
                    ? Number.parseFloat(e.target.value)
                    : null,
                })
              }
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <label
              htmlFor="completedAt"
              style={{ display: "block", marginBottom: 5 }}
            >
              Completed At
            </label>
            <input
              id="completedAt"
              type="text"
              value={formData.completedAt ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  completedAt: e.target.value ? e.target.value : null,
                })
              }
              style={{ width: "100%", padding: 8, fontSize: 16 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label
              htmlFor="notes"
              style={{ display: "block", marginBottom: 5 }}
            >
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value || null })
              }
              style={{ width: "100%", padding: 8, fontSize: 16, minHeight: 80 }}
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            style={{
              padding: "10px 20px",
              fontSize: 16,
              cursor: "pointer",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
            }}
          >
            {createMutation.isPending ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <MediaList />
    </div>
  );
}

export default App;
