import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText } from "lucide-react";
import { toast } from "react-toastify";
import {
  paymentHistoryApi,
  PaymentHistory,
  CreatePaymentHistoryData,
  UpdatePaymentHistoryData,
} from "../../services/paymentHistoryApi";
import PaymentHistoryModal from "../../components/payment-history/PaymentHistoryModal";
import PaymentHistoryTable from "../../components/payment-history/PaymentHistoryTable";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/common/Pagination";

const PaymentHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentHistories, setPaymentHistories] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedPaymentHistory, setSelectedPaymentHistory] = useState<PaymentHistory | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentHistoryToDelete, setPaymentHistoryToDelete] = useState<PaymentHistory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPaymentHistories();
  }, [currentPage, searchTerm]);

  const fetchPaymentHistories = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
        per_page: perPage,
        sort_by: "created_at",
        sort_order: "desc",
      };

      if (searchTerm) params.search = searchTerm;

      const response = await paymentHistoryApi.getPaymentHistories(params);

      setPaymentHistories(response.data || []);
      setTotalPages(response.last_page || 1);
      setTotalItems(response.total || 0);
    } catch (error) {
      console.error("Error fetching payment histories:", error);
      toast.error("Failed to fetch payment histories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPaymentHistory(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleView = (paymentHistory: PaymentHistory) => {
    navigate(`/admin/payment-history/view/${paymentHistory.id}`);
  };

  const handleEdit = (paymentHistory: PaymentHistory) => {
    setSelectedPaymentHistory(paymentHistory);
    setModalMode("update");
    setShowModal(true);
  };

  const handleDelete = (paymentHistory: PaymentHistory) => {
    setPaymentHistoryToDelete(paymentHistory);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!paymentHistoryToDelete) return;

    setIsDeleting(true);
    try {
      const response = await paymentHistoryApi.deletePaymentHistory(
        paymentHistoryToDelete.id
      );
      if (response.success) {
        toast.success("Payment history deleted successfully");
        fetchPaymentHistories();
        setShowDeleteModal(false);
        setPaymentHistoryToDelete(null);
      } else {
        toast.error(response.message || "Failed to delete payment history");
      }
    } catch (error) {
      console.error("Error deleting payment history:", error);
      toast.error("Failed to delete payment history");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModalSubmit = async (
    data: CreatePaymentHistoryData | UpdatePaymentHistoryData
  ) => {
    try {
      if (modalMode === "update" && selectedPaymentHistory) {
        const response = await paymentHistoryApi.updatePaymentHistory(
          selectedPaymentHistory.id,
          data as UpdatePaymentHistoryData
        );
        if (response.success) {
          toast.success("Payment history updated successfully");
          setShowModal(false);
          setSelectedPaymentHistory(null);
          fetchPaymentHistories();
        } else {
          toast.error(response.message || "Failed to update payment history");
        }
      } else {
        const response = await paymentHistoryApi.createPaymentHistory(
          data as CreatePaymentHistoryData
        );
        if (response.success) {
          toast.success("Payment history created successfully");
          setShowModal(false);
          fetchPaymentHistories();
        } else {
          toast.error(response.message || "Failed to create payment history");
        }
      }
    } catch (error) {
      console.error("Error saving payment history:", error);
      toast.error("Failed to save payment history");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-indigo-50 p-4 py-6">
      <div className="max-w-full mx-auto px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary-600" />
              Payment History
            </h1>
            <p className="text-gray-600 mt-1">
              Manage payment history records
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Payment History
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
              placeholder="Search by showroom name, NID, contact number, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      <PaymentHistoryTable
        paymentHistories={paymentHistories}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onRefresh={fetchPaymentHistories}
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
      <PaymentHistoryModal
        isOpen={showModal}
        mode={modalMode}
        paymentHistory={selectedPaymentHistory}
        onClose={() => {
          setShowModal(false);
          setSelectedPaymentHistory(null);
        }}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Payment History"
        message={`Are you sure you want to delete payment history #${paymentHistoryToDelete?.id}? This action will also delete all associated installments and cannot be undone.`}
        onClose={() => {
          setShowDeleteModal(false);
          setPaymentHistoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
