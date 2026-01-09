import { useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addAsset,
  updateAsset,
  deleteAsset,
} from "../store/slices/assetsSlice";
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Table,
  Badge,
  ConfirmDialog,
} from "../components/ui";
import { toast } from "sonner";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { filterBySearchTerm, formatDate } from "../utils";
import type { Asset, AssetStatus } from "../types";

export const Assets = () => {
  const dispatch = useAppDispatch();
  const assets = useAppSelector((state) => state.assets.assets);
  const parts = useAppSelector((state) => state.parts.parts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "update" | "delete";
    asset?: Asset;
  }>({ isOpen: false, type: "delete" });

  const [formData, setFormData] = useState({
    partId: "",
    serialNumber: "",
    status: "available" as AssetStatus,
    notes: "",
  });

  const filteredAssets = useMemo(() => {
    return [...assets]
      .filter((asset) => {
        const matchesSearch =
          asset.serialNumber
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          asset.notes?.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [assets, debouncedSearch]);

  const handleOpenModal = (asset?: Asset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        partId: asset.partId,
        serialNumber: asset.serialNumber,
        status: asset.status,
        notes: asset.notes || "",
      });
    } else {
      setEditingAsset(null);
      setFormData({
        partId: parts[0]?.id || "",
        serialNumber: "",
        status: "available",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAsset) {
      setConfirmDialog({
        isOpen: true,
        type: "update",
        asset: editingAsset,
      });
    } else {
      dispatch(addAsset(formData));
      toast.success("Asset added successfully!");
      handleCloseModal();
    }
  };

  const handleConfirmUpdate = () => {
    if (confirmDialog.asset) {
      dispatch(
        updateAsset({
          ...confirmDialog.asset,
          ...formData,
        })
      );
      toast.success("Asset updated successfully!");
      handleCloseModal();
    }
  };

  const handleDelete = (asset: Asset) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      asset,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.asset) {
      dispatch(deleteAsset(confirmDialog.asset.id));
      toast.success("Asset deleted successfully!");
    }
  };

  const getStatusBadge = (status: AssetStatus) => {
    const variants = {
      available: "success" as const,
      assigned: "warning" as const,
      maintenance: "danger" as const,
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const columns = [
    {
      key: "serialNumber",
      header: "Serial Number",
      render: (asset: Asset) => (
        <span className="font-medium text-slate-900">{asset.serialNumber}</span>
      ),
    },
    {
      key: "part",
      header: "Part",
      render: (asset: Asset) => {
        const part = parts.find((p) => p.id === asset.partId);
        return (
          <div>
            <p className="font-medium text-slate-900">
              {part?.name || "Unknown"}
            </p>
            <p className="text-sm text-slate-500">{part?.type}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (asset: Asset) => getStatusBadge(asset.status),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (asset: Asset) => (
        <span className="text-slate-600">{formatDate(asset.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (asset: Asset) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(asset)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(asset)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
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
            Assets Management
          </h1>
          <p className="text-slate-600 mt-1">
            Track and manage construction assets
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} disabled={parts.length === 0}>
          <Plus size={20} className="mr-2" />
          Add Asset
        </Button>
      </div>

      {parts.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-slate-600">
              Please add parts first before creating assets.
            </p>
          </div>
        </Card>
      )}

      {parts.length > 0 && (
        <Card>
          <div className="mb-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <Input
                type="text"
                placeholder="Search assets by serial number or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table
            data={filteredAssets}
            columns={columns}
            emptyMessage="No assets found"
          />
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAsset ? "Edit Asset" : "Add New Asset"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Part"
            required
            value={formData.partId}
            onChange={(e) =>
              setFormData({ ...formData, partId: e.target.value })
            }
            options={parts.map((part) => ({
              value: part.id,
              label: `${part.name} (${part.type})`,
            }))}
          />

          <Input
            label="Serial Number"
            type="text"
            required
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            placeholder="Enter serial number"
          />

          <Select
            label="Status"
            required
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as AssetStatus,
              })
            }
            options={[
              { value: "available", label: "Available" },
              { value: "assigned", label: "Assigned" },
              { value: "maintenance", label: "Maintenance" },
            ]}
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
              placeholder="Enter notes"
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
              {editingAsset ? "Update Asset" : "Add Asset"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={
          confirmDialog.type === "update"
            ? handleConfirmUpdate
            : handleConfirmDelete
        }
        title={
          confirmDialog.type === "update" ? "Confirm Update" : "Confirm Delete"
        }
        message={
          confirmDialog.type === "update"
            ? "Are you sure you want to update this asset? This action will modify the asset details."
            : `Are you sure you want to delete asset "${confirmDialog.asset?.serialNumber}"? This action cannot be undone.`
        }
        confirmText={confirmDialog.type === "update" ? "Update" : "Delete"}
        variant={confirmDialog.type === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};
