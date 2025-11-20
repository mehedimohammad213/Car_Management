import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import { toast } from "react-toastify";
import {
  purchaseHistoryApi,
  PurchaseHistory,
  CreatePurchaseHistoryData,
  UpdatePurchaseHistoryData,
} from "../../services/purchaseHistoryApi";
import PurchaseHistoryModal from "../../components/purchase-history/PurchaseHistoryModal";
import PurchaseHistoryTable from "../../components/purchase-history/PurchaseHistoryTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/common/Pagination";

const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { editId?: number } };
  const [purchaseHistories, setPurchaseHistories] = useState<PurchaseHistory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedPurchaseHistory, setSelectedPurchaseHistory] =
    useState<PurchaseHistory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseHistoryToDelete, setPurchaseHistoryToDelete] =
    useState<PurchaseHistory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPurchaseHistories();
  }, [currentPage, searchTerm]);

  // Open edit modal if navigated with state { editId }
  useEffect(() => {
    if (!loading && purchaseHistories.length > 0 && location.state?.editId) {
      const toEdit = purchaseHistories.find(
        (ph) => ph.id === location.state!.editId
      );
      if (toEdit) {
        setSelectedPurchaseHistory(toEdit);
        setModalMode("update");
        setShowModal(true);
      }
      // Do not attempt to clear the history state here to avoid navigation issues
    }
  }, [loading, purchaseHistories, location.state]);

  const fetchPurchaseHistories = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        per_page: perPage,
        sort_by: "created_at",
        sort_order: "desc",
      };

      if (searchTerm) params.search = searchTerm;

      const response = await purchaseHistoryApi.getPurchaseHistories(params);

      setPurchaseHistories(response.data || []);
      setTotalPages(response.last_page || 1);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error fetching purchase histories:", error);
      toast.error("Failed to fetch purchase histories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPurchaseHistory(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleView = (purchaseHistory: PurchaseHistory) => {
    navigate(`/admin/purchase-history/view/${purchaseHistory.id}`);
  };

  const handleEdit = (purchaseHistory: PurchaseHistory) => {
    setSelectedPurchaseHistory(purchaseHistory);
    setModalMode("update");
    setShowModal(true);
  };

  const handleDelete = (purchaseHistory: PurchaseHistory) => {
    setPurchaseHistoryToDelete(purchaseHistory);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!purchaseHistoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await purchaseHistoryApi.deletePurchaseHistory(
        purchaseHistoryToDelete.id
      );
      if (response.success) {
        toast.success("Purchase history deleted successfully");
        fetchPurchaseHistories();
        setShowDeleteModal(false);
        setPurchaseHistoryToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete purchase history");
      }
    } catch (error) {
      console.error("Error deleting purchase history:", error);
      toast.error("Failed to delete purchase history");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (
    data: CreatePurchaseHistoryData | UpdatePurchaseHistoryData
  ) => {
    try {
      if (modalMode === "update" && selectedPurchaseHistory) {
        const response = await purchaseHistoryApi.updatePurchaseHistory(
          selectedPurchaseHistory.id,
          data as UpdatePurchaseHistoryData
        );
        if (response.success) {
          toast.success("Purchase history updated successfully");
          setShowModal(false);
          setSelectedPurchaseHistory(null);
          fetchPurchaseHistories();
        navigate("/admin/purchase-history");
        } else {
          toast.error(response.message || "Failed to update purchase history");
        }
      } else {
        const response = await purchaseHistoryApi.createPurchaseHistory(
          data as CreatePurchaseHistoryData
        );
        if (response.success) {
          toast.success("Purchase history created successfully");
          setShowModal(false);
          fetchPurchaseHistories();
        } else {
          toast.error(response.message || "Failed to create purchase history");
        }
      }
    } catch (error) {
      console.error("Error saving purchase history:", error);
      toast.error("Failed to save purchase history");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Purchase History
            </h1>
            <p className="text-gray-600 mt-1">
              Manage purchase history records
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Purchase History
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by LC number, invoice number, bank name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Clear Filters Button */}
          {searchTerm && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <PurchaseHistoryTable
        purchaseHistories={purchaseHistories}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRefresh={fetchPurchaseHistories}
      />

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modal */}
      <PurchaseHistoryModal
        isOpen={showModal}
        mode={modalMode}
        purchaseHistory={selectedPurchaseHistory}
        onClose={() => {
          setShowModal(false);
          setSelectedPurchaseHistory(null);
        }}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Purchase History"
        message={`Are you sure you want to delete purchase history #${purchaseHistoryToDelete?.id}? This action cannot be undone.`}
        onClose={() => {
          setShowDeleteModal(false);
          setPurchaseHistoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
