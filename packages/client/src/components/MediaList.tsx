import {
  MEDIA_STATUSES,
  MEDIA_TYPES,
  type MediaItem,
  type MediaItemUpdate,
} from "@media-crm/shared";
import { useState } from "react";
import { trpc } from "../trpc";

export function MediaList() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<MediaItemUpdate>({});

  const { data: items, isLoading, error } = trpc.media.list.useQuery();
  const utils = trpc.useUtils();

  const updateMutation = trpc.media.update.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
      setEditingId(null);
      setEditData({});
    },
  });

  const deleteMutation = trpc.media.delete.useMutation({
    onSuccess: () => {
      utils.media.list.invalidate();
    },
  });

  const startEdit = (item: MediaItem) => {
    setEditingId(item.id);
    setEditData({
      title: item.title,
      type: item.type,
      status: item.status,
      rating: item.rating,
      notes: item.notes,
      completedAt: item.completedAt,
    });
  };

  const handleUpdate = (id: number) => {
    updateMutation.mutate({ id, data: editData });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!items?.length) return <div>No media items yet. Add one above!</div>;

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: "white",
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {editingId === item.id ? (
            <div>
              <input
                type="text"
                value={editData.title ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <select
                  value={editData.type}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      type: e.target.value as MediaItem["type"],
                    })
                  }
                  style={{ flex: 1, padding: 8 }}
                >
                  {MEDIA_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <select
                  value={editData.status}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      status: e.target.value as MediaItem["status"],
                    })
                  }
                  style={{ flex: 1, padding: 8 }}
                >
                  {MEDIA_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={editData.completedAt ?? ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      completedAt: e.target.value || null,
                    })
                  }
                  placeholder="Completed At"
                  style={{ width: 80, padding: 8 }}
                />

                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={editData.rating ?? ""}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      rating: e.target.value
                        ? Number.parseFloat(e.target.value)
                        : null,
                    })
                  }
                  placeholder="Rating"
                  style={{ width: 80, padding: 8 }}
                />
              </div>
              <textarea
                value={editData.notes ?? ""}
                onChange={(e) =>
                  setEditData({ ...editData, notes: e.target.value })
                }
                placeholder="Notes"
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleUpdate(item.id)}
                  disabled={updateMutation.isPending}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 5px 0" }}>{item.title}</h3>
                  <div style={{ color: "#666", fontSize: 14 }}>
                    <span
                      style={{
                        background: "#e9ecef",
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    >
                      {item.type.replace("_", " ")}
                    </span>
                    <span
                      style={{
                        background: "#d4edda",
                        padding: "2px 8px",
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    >
                      {item.status.replace(/_/g, " ")}
                    </span>
                    {item.rating !== null && (
                      <span>Rating: {item.rating}/10</span>
                    )}
                    {item.completedAt !== null && (
                      <span>Completed on: {item.completedAt}</span>
                    )}
                  </div>
                  {item.notes && (
                    <p style={{ margin: "10px 0 0 0", color: "#555" }}>
                      {item.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => startEdit(item)}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleteMutation.isPending}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
