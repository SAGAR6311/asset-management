import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addPart, updatePart, deletePart } from "../store/slices/partsSlice";
import {
  Card,
  Button,
  Modal,
  Table,
  Badge,
  ConfirmDialog,
} from "../components/ui";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";
import { PART_TYPES, PART_CATEGORIES } from "../constants";
import { formatDate } from "../utils";
import { partSchema, type PartFormData } from "../schemas/validationSchemas";
import type { Part } from "../types";

export const Parts = () => {
  const dispatch = useAppDispatch();
  const parts = useAppSelector((state) => state.parts.parts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "update" | "delete";
    part?: Part;
  }>({ isOpen: false, type: "delete" });

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<PartFormData>({
    resolver: zodResolver(partSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      type: "Electrical",
      category: "Consumable",
      description: "",
      quantity: 0,
    },
  });

  const filteredParts = useMemo(() => {
    return [...parts]
      .filter((part) =>
        ["name", "type", "category", "description"].some((key) =>
          part[key as keyof Part]
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        )
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [parts, debouncedSearch]);

  const handleOpenModal = (part?: Part) => {
    if (part) {
      setEditingPart(part);
      reset({
        name: part.name,
        type: part.type,
        category: part.category,
        description: part.description || "",
        quantity: part.quantity,
      });
    } else {
      setEditingPart(null);
      reset({
        name: "",
        type: "Electrical",
        category: "Consumable",
        description: "",
        quantity: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
  };

  const onSubmit = (data: PartFormData) => {
    if (editingPart) {
      setConfirmDialog({
        isOpen: true,
        type: "update",
        part: editingPart,
      });
    } else {
      dispatch(
        addPart({
          ...data,
          quantity: Number(data.quantity),
        } as any)
      );
      toast.success("Part added successfully!");
      handleCloseModal();
    }
  };

  const handleConfirmUpdate = () => {
    handleFormSubmit((data) => {
      if (confirmDialog.part) {
        dispatch(
          updatePart({
            ...confirmDialog.part,
            ...data,
            quantity: Number(data.quantity),
          } as any)
        );
        toast.success("Part updated successfully!");
        handleCloseModal();
      }
    })();
  };

  const handleDelete = (part: Part) => {
    setConfirmDialog({
      isOpen: true,
      type: "delete",
      part,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.part) {
      dispatch(deletePart(confirmDialog.part.id));
      toast.success("Part deleted successfully!");
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (part: Part) => (
        <div>
          <p className="font-medium text-slate-900">{part.name}</p>
          {part.description && (
            <p className="text-sm text-slate-500">{part.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (part: Part) => <Badge variant="info">{part.type}</Badge>,
    },
    {
      key: "category",
      header: "Category",
      render: (part: Part) => <Badge variant="default">{part.category}</Badge>,
    },
    {
      key: "quantity",
      header: "Quantity",
      render: (part: Part) => (
        <span className="font-medium text-slate-900">{part.quantity}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (part: Part) => (
        <span className="text-slate-600">{formatDate(part.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (part: Part) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(part)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(part)}
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
            Parts Management
          </h1>
          <p className="text-slate-600 mt-1">
            Manage construction parts inventory
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Add Part
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search parts by name, type, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <Table
          data={filteredParts}
          columns={columns}
          emptyMessage="No parts found"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPart ? "Edit Part" : "Add New Part"}
        size="md"
      >
        <form
          onSubmit={handleFormSubmit(onSubmit as any)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Part Name *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter part name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type *
            </label>
            <select
              {...register("type")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.type ? "border-red-500" : "border-slate-300"
              }`}
            >
              {PART_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Category *
            </label>
            <select
              {...register("category")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? "border-red-500" : "border-slate-300"
              }`}
            >
              {PART_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Quantity *
            </label>
            <input
              {...register("quantity", { valueAsNumber: true })}
              type="number"
              min="0"
              placeholder="Enter quantity"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.quantity ? "border-red-500" : "border-slate-300"
              }`}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register("description")}
              placeholder="Enter part description"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-slate-300"
              }`}
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
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
              {editingPart ? "Update Part" : "Add Part"}
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
            ? "Are you sure you want to update this part? This action will modify the part details."
            : `Are you sure you want to delete "${confirmDialog.part?.name}"? This action cannot be undone.`
        }
        confirmText={confirmDialog.type === "update" ? "Update" : "Delete"}
        variant={confirmDialog.type === "delete" ? "danger" : "primary"}
      />
    </div>
  );
};
