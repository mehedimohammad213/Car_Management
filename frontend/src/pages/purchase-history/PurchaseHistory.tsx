import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, X, Eye } from "lucide-react";
import { toast } from "react-toastify";
import {
  purchaseHistoryApi,
  PurchaseHistory,
  CreatePurchaseHistoryData,
  UpdatePurchaseHistoryData,
} from "../../services/purchaseHistoryApi";
import PurchaseHistoryModal from "../../components/purchase-history/PurchaseHistoryModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/common/Pagination";

const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
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
  const [purchaseDateFrom, setPurchaseDateFrom] = useState("");
  const [purchaseDateTo, setPurchaseDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPurchaseHistories();
  }, [currentPage, searchTerm, purchaseDateFrom, purchaseDateTo]);

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
      if (purchaseDateFrom) params.purchase_date_from = purchaseDateFrom;
      if (purchaseDateTo) params.purchase_date_to = purchaseDateTo;

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  };

  const getPdfUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${baseUrl}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
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
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by LC number, invoice number, bank name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date From
                </label>
                <input
                  type="date"
                  value={purchaseDateFrom}
                  onChange={(e) => setPurchaseDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date To
                </label>
                <input
                  type="date"
                  value={purchaseDateTo}
                  onChange={(e) => setPurchaseDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setPurchaseDateFrom("");
                    setPurchaseDateTo("");
                    setSearchTerm("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : purchaseHistories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No purchase histories found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Car</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Purchase Date
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Purchase Amount
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      LC Number
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      LC Bank
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {purchaseHistories.map((ph) => (
                    <tr
                      key={ph.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={(e) => {
                        // Only navigate if clicking on the row, not on buttons
                        if ((e.target as HTMLElement).closest("button")) return;
                        handleView(ph);
                      }}
                    >
                      <td className="px-6 py-4">{ph.id}</td>
                      <td className="px-6 py-4">
                        {ph.car
                          ? `${ph.car.make} ${ph.car.model}${
                              ph.car.ref_no ? ` (${ph.car.ref_no})` : ""
                            }`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(ph.purchase_date)}
                      </td>
                      <td className="px-6 py-4">
                        {formatCurrency(ph.purchase_amount)}
                      </td>
                      <td className="px-6 py-4">{ph.lc_number || "N/A"}</td>
                      <td className="px-6 py-4">{ph.lc_bank_name || "N/A"}</td>
                      <td
                        className="px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(ph)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(ph)}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ph)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  perPage={perPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>

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
  );
};

export default PurchaseHistoryPage;
