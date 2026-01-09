import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addUtilization,
  updateUtilization,
  deleteUtilization,
  completeUtilization,
} from "../store/slices/utilizationSlice";
import { assignAsset, unassignAsset } from "../store/slices/assetsSlice";
import {
  Card,
  Button,
  Select,
  Modal,
  Table,
  Badge,
  ConfirmDialog,
} from "../components/ui";
import { Plus, CheckCircle, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";
import { formatDate } from "../utils";
import type { Utilization } from "../types";

export const UtilizationPage = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector((state) => state.assets.assets);
  const parts = useAppSelector((state) => state.parts.parts);
  const teamMembers = useAppSelector((state) => state.teamMembers.members);
  const utilizations = useAppSelector(
    (state) => state.utilization.utilizations
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUtilization, setEditingUtilization] =
    useState<Utilization | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [teamMemberFilter, setTeamMemberFilter] = useState<string>("all");
  const debouncedSearch = useDebounce(searchTerm);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "complete" | "delete";
    utilization?: Utilization;
  }>({ isOpen: false, type: "complete" });
  const [formData, setFormData] = useState({
    assetId: "",
    teamMemberId: "",
    notes: "",
  });

  const availableAssets = useMemo(() => {
    return assets.filter((asset) => asset.status === "available");
  }, [assets]);

  const activeUtilizations = useMemo(() => {
    return utilizations.filter((util) => util.status === "active");
  }, [utilizations]);

  const filteredUtilizations = useMemo(() => {
    let filtered = utilizations;

    if (statusFilter !== "all") {
      filtered = filtered.filter((util) => util.status === statusFilter);
    }

    if (teamMemberFilter !== "all") {
      filtered = filtered.filter(
        (util) => util.teamMemberId === teamMemberFilter
      );
    }

    if (debouncedSearch.trim()) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter((util) => {
        const asset = assets.find((a) => a.id === util.assetId);
        const part = asset ? parts.find((p) => p.id === asset.partId) : null;
        const member = teamMembers.find((m) => m.id === util.teamMemberId);

        const matchesSearch =
          part?.name.toLowerCase().includes(searchLower) ||
          asset?.serialNumber.toLowerCase().includes(searchLower) ||
          member?.name.toLowerCase().includes(searchLower) ||
          member?.role.toLowerCase().includes(searchLower) ||
          util.notes?.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "all" || util.status === statusFilter;
        const matchesMember =
          teamMemberFilter === "all" || util.teamMemberId === teamMemberFilter;

        return matchesSearch && matchesStatus && matchesMember;
      });
    }

    return [...filtered].sort(
      (a, b) =>
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
    );
  }, [
    utilizations,
    debouncedSearch,
    statusFilter,
    teamMemberFilter,
    assets,
    parts,
    teamMembers,
  ]);

  const handleOpenModal = (utilization?: Utilization) => {
    if (utilization) {
      setEditingUtilization(utilization);
      setFormData({
        assetId: utilization.assetId,
        teamMemberId: utilization.teamMemberId,
        notes: utilization.notes || "",
      });
    } else {
      setEditingUtilization(null);
      setFormData({
        assetId: availableAssets[0]?.id || "",
        teamMemberId: teamMembers[0]?.id || "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUtilization(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUtilization) {
      dispatch(
        updateUtilization({
          ...editingUtilization,
          assetId: formData.assetId,
          teamMemberId: formData.teamMemberId,
          notes: formData.notes,
        })
      );
      toast.success("Utilization updated successfully!");
    } else {
      dispatch(
        addUtilization({
          assetId: formData.assetId,
          teamMemberId: formData.teamMemberId,
          assignedDate: new Date().toISOString(),
          status: "active",
          notes: formData.notes,
        })
      );

      dispatch(
        assignAsset({
          assetId: formData.assetId,
          teamMemberId: formData.teamMemberId,
        })
      );

      toast.success("Asset assigned successfully!");
    }

    handleCloseModal();
  };

  const handleComplete = (utilization: Utilization) => {
    setConfirmDialog({
      isOpen: true,
      type: "complete",
      utilization,
    });
  };

  const handleDelete = (utilization: Utilization) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      utilization,
    });
  };

  const handleConfirmComplete = () => {
    if (confirmDialog.utilization) {
      dispatch(completeUtilization(confirmDialog.utilization.id));
      dispatch(unassignAsset(confirmDialog.utilization.assetId));
      setConfirmDialog({ isOpen: false, type: "complete" });
      toast.success("Utilization marked as completed!");
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.utilization) {
      if (confirmDialog.utilization.status === "active") {
        dispatch(unassignAsset(confirmDialog.utilization.assetId));
      }
      dispatch(deleteUtilization(confirmDialog.utilization.id));
      setConfirmDialog({ isOpen: false, type: "delete" });
      toast.success("Utilization deleted successfully!");
    }
  };

  const columns = [
    {
      key: "asset",
      header: "Asset",
      render: (util: Utilization) => {
        const asset = assets.find((a) => a.id === util.assetId);
        const part = asset ? parts.find((p) => p.id === asset.partId) : null;
        return (
          <div>
            <p className="font-medium text-slate-900">
              {part?.name || "Unknown"}
            </p>
            <p className="text-sm text-slate-500">
              {asset?.serialNumber || "N/A"}
            </p>
          </div>
        );
      },
    },
    {
      key: "teamMember",
      header: "Team Member",
      render: (util: Utilization) => {
        const member = teamMembers.find((m) => m.id === util.teamMemberId);
        return (
          <div>
            <p className="font-medium text-slate-900">
              {member?.name || "Unknown"}
            </p>
            <p className="text-sm text-slate-500">{member?.role}</p>
          </div>
        );
      },
    },
    {
      key: "assignedDate",
      header: "Assigned Date",
      render: (util: Utilization) => (
        <span className="text-slate-600">{formatDate(util.assignedDate)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (util: Utilization) => (
        <Badge variant={util.status === "active" ? "success" : "default"}>
          {util.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (util: Utilization) => (
        <div className="flex gap-2">
          {util.status === "active" && (
            <>
              <button
                onClick={() => handleOpenModal(util)}
                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleComplete(util)}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                title="Complete"
              >
                <CheckCircle size={18} />
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(util)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Asset Utilization
          </h1>
          <p className="text-slate-600 mt-1">
            Assign assets to team members and track usage
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          disabled={availableAssets.length === 0 || teamMembers.length === 0}
        >
          <Plus size={20} className="mr-2" />
          Assign Asset
        </Button>
      </div>

      {(availableAssets.length === 0 || teamMembers.length === 0) && (
        <Card>
          <div className="text-center py-8">
            <p className="text-slate-600">
              {availableAssets.length === 0
                ? "No available assets to assign. Please add assets first."
                : "No team members available."}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="!p-6">
          <p className="text-sm text-slate-600 font-medium">
            Active Assignments
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {activeUtilizations.length}
          </p>
        </Card>
        <Card className="!p-6">
          <p className="text-sm text-slate-600 font-medium">Available Assets</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {availableAssets.length}
          </p>
        </Card>
        <Card className="!p-6">
          <p className="text-sm text-slate-600 font-medium">
            Total Utilizations
          </p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {utilizations.length}
          </p>
        </Card>
      </div>

      <Card title="All Utilizations">
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by asset, member, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <Select
              label=""
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "active" | "completed"
                )
              }
              options={[
                { value: "all", label: "All Status" },
                { value: "active", label: "Active Only" },
                { value: "completed", label: "Completed Only" },
              ]}
            />

            <Select
              label=""
              value={teamMemberFilter}
              onChange={(e) => setTeamMemberFilter(e.target.value)}
              options={[
                { value: "all", label: "All Team Members" },
                ...teamMembers.map((member) => ({
                  value: member.id,
                  label: member.name,
                })),
              ]}
            />
          </div>

          {(searchTerm ||
            statusFilter !== "all" ||
            teamMemberFilter !== "all") && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-medium">
                Showing {filteredUtilizations.length} of {utilizations.length}{" "}
                records
              </span>
              {(searchTerm ||
                statusFilter !== "all" ||
                teamMemberFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setTeamMemberFilter("all");
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        <Table
          data={filteredUtilizations}
          columns={columns}
          emptyMessage="No utilization records found"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingUtilization
            ? "Edit Utilization"
            : "Assign Asset to Team Member"
        }
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Asset"
            required
            value={formData.assetId}
            onChange={(e) =>
              setFormData({ ...formData, assetId: e.target.value })
            }
            options={availableAssets.map((asset) => {
              const part = parts.find((p) => p.id === asset.partId);
              return {
                value: asset.id,
                label: `${part?.name || "Unknown"} - ${asset.serialNumber}`,
              };
            })}
          />

          <Select
            label="Select Team Member"
            required
            value={formData.teamMemberId}
            onChange={(e) =>
              setFormData({ ...formData, teamMemberId: e.target.value })
            }
            options={teamMembers.map((member) => ({
              value: member.id,
              label: `${member.name} (${member.role})`,
            }))}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Enter assignment notes"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingUtilization ? "Update" : "Assign Asset"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={
          confirmDialog.type === "complete"
            ? handleConfirmComplete
            : handleConfirmDelete
        }
        title={
          confirmDialog.type === "complete"
            ? "Complete Utilization"
            : "Delete Utilization"
        }
        message={
          confirmDialog.utilization ? (
            <div>
              {confirmDialog.type === "complete" ? (
                <>
                  <p>
                    Are you sure you want to mark this utilization as completed?
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    This will return the asset to available status.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Are you sure you want to delete this utilization record?
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {confirmDialog.utilization.status === "active"
                      ? "The asset will be returned to available status."
                      : "This action cannot be undone."}
                  </p>
                </>
              )}
            </div>
          ) : (
            ""
          )
        }
        confirmText={confirmDialog.type === "complete" ? "Complete" : "Delete"}
        variant={confirmDialog.type === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};
