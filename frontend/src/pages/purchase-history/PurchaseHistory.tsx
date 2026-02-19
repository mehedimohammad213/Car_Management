import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  purchaseHistoryApi,
  PurchaseHistory,
  CreatePurchaseHistoryData,
  UpdatePurchaseHistoryData,
} from "../../services/purchaseHistoryApi";
import PurchaseHistoryModal from "../../components/purchase-history/PurchaseHistoryModal";
import PurchaseHistoryTable from "../../components/purchase-history/PurchaseHistoryTable";
import PurchaseHistoryLCView from "../../components/purchase-history/PurchaseHistoryLCView";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/car/Pagination";
import { LayoutGrid, List } from "lucide-react";

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
    useState<PurchaseHistory | PurchaseHistory[] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseHistoryToDelete, setPurchaseHistoryToDelete] =
    useState<PurchaseHistory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "lc_wise">("history");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPurchaseHistories();
  }, [currentPage, searchTerm, filterMonth, filterYear]);

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
      if (filterMonth) params.lc_month = filterMonth;
      if (filterYear) params.lc_year = filterYear;

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

  const handleEdit = (purchaseHistory: PurchaseHistory | PurchaseHistory[]) => {
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
    data: CreatePurchaseHistoryData | UpdatePurchaseHistoryData | CreatePurchaseHistoryData[]
  ) => {
    try {
      if (Array.isArray(data)) {
        let successCount = 0;
        let failCount = 0;

        for (const item of data) {
          const itemWithId = item as (CreatePurchaseHistoryData & { id?: number });
          let response;

          if (modalMode === "update" && itemWithId.id) {
            // Update existing record
            response = await purchaseHistoryApi.updatePurchaseHistory(itemWithId.id, item);
          } else {
            // Create new record
            response = await purchaseHistoryApi.createPurchaseHistory(item);
          }

          if (response.success) {
            successCount++;
          } else {
            failCount++;
            console.error(`Failed to ${itemWithId.id ? 'update' : 'create'} purchase history:`, response.message);
          }
        }

        if (successCount > 0) {
          toast.success(`${successCount} records processed successfully`);
          setShowModal(false);
          fetchPurchaseHistories();
        }
        if (failCount > 0) {
          toast.error(`${failCount} records failed`);
        }
        return;
      }

      if (modalMode === "update" && selectedPurchaseHistory) {
        const historyToUpdate = Array.isArray(selectedPurchaseHistory) ? selectedPurchaseHistory[0] : selectedPurchaseHistory;
        const response = await purchaseHistoryApi.updatePurchaseHistory(
          historyToUpdate.id,
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
    setFilterMonth("");
    setFilterYear("");
    setCurrentPage(1);
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  const hasActiveFilters = searchTerm || filterMonth || filterYear;

  return (
    <div className="min-h-screen">
      <div className="max-w-full mx-auto px-4 pb-6">
        {/* Header - same style as Car page */}
        <div className="p-0 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">
                Purchases / Purchase History
              </h1>
            </div>
            {/* Tab Selection - right side of header */}
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "history"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                History Table
              </button>
              <button
                onClick={() => setActiveTab("lc_wise")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "lc_wise"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                LC Wise View
              </button>
            </div>
          </div>
        </div>

        {/* Filters - same layout as Car SearchFilters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by LC number, invoice number, bank name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="w-full lg:w-auto min-w-[150px]">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Months</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-auto min-w-[120px]">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full lg:w-auto min-w-[120px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                title="Clear Filters"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Purchase History
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "history" ? (
          <PurchaseHistoryTable
            purchaseHistories={purchaseHistories}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onRefresh={fetchPurchaseHistories}
          />
        ) : (
          <PurchaseHistoryLCView
            purchaseHistories={purchaseHistories}
            isLoading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination - same as Car page */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          perPage={perPage}
          onPageChange={setCurrentPage}
        />

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
