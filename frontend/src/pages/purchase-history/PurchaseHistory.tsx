import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  purchaseHistoryApi,
  PurchaseHistory,
} from "../../services/purchaseHistoryApi";
import PurchaseHistoryTable from "../../components/purchase-history/PurchaseHistoryTable";
import PurchaseHistoryLCView from "../../components/purchase-history/PurchaseHistoryLCView";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Pagination from "../../components/car/Pagination";

const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [purchaseHistories, setPurchaseHistories] = useState<PurchaseHistory[]>(
    []
  );
  const [lcHistoriesAll, setLcHistoriesAll] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [purchaseHistoryToDelete, setPurchaseHistoryToDelete] =
    useState<PurchaseHistory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  type PurchaseTab = "history" | "lc_wise";
  const allowedTabs: PurchaseTab[] = ["lc_wise", "history"];
  const tabParam = searchParams.get("tab");
  const initialTab: PurchaseTab =
    tabParam && allowedTabs.includes(tabParam as PurchaseTab)
      ? (tabParam as PurchaseTab)
      : "lc_wise";

  const [activeTab, setActiveTab] = useState<PurchaseTab>(initialTab);

  // Sync tab from URL (`/admin/purchase-history?tab=lc_wise|history`).
  useEffect(() => {
    const t = searchParams.get("tab") as PurchaseTab | null;
    if (!t) return;
    if (!allowedTabs.includes(t)) return;
    setActiveTab(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const HISTORY_PER_PAGE = 15;
  const LC_PER_PAGE = 10;
  // Frontend LC-wise pagination needs a complete enough dataset to group by `lc_number`.
  // Increase this if you have many LC groups and still see missing groups.
  const LC_FETCH_PER_PAGE = 1000;
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  type GetPurchaseHistoriesParams = NonNullable<
    Parameters<typeof purchaseHistoryApi.getPurchaseHistories>[0]
  >;

  useEffect(() => {
    // When switching tab or changing filters/search, always restart pagination.
    setCurrentPage(1);
  }, [activeTab, searchTerm, filterMonth, filterYear]);

  useEffect(() => {
    if (activeTab !== "history") return;
    fetchHistoryPurchaseHistories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage, searchTerm, filterMonth, filterYear]);

  useEffect(() => {
    if (activeTab !== "lc_wise") return;
    fetchLcHistoriesAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, searchTerm, filterMonth, filterYear]);

  const fetchHistoryPurchaseHistories = async () => {
    try {
      setLoading(true);
      const params: GetPurchaseHistoriesParams = {
        page: currentPage,
        per_page: HISTORY_PER_PAGE,
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

  const fetchLcHistoriesAll = async () => {
    try {
      setLoading(true);
      const params: GetPurchaseHistoriesParams = {
        page: 1,
        per_page: LC_FETCH_PER_PAGE,
        sort_by: "created_at",
        sort_order: "desc",
      };

      if (searchTerm) params.search = searchTerm;
      if (filterMonth) params.lc_month = filterMonth;
      if (filterYear) params.lc_year = filterYear;

      const response = await purchaseHistoryApi.getPurchaseHistories(params);
      setLcHistoriesAll(response.data || []);
    } catch (error) {
      console.error("Error fetching LC-wise purchase histories:", error);
      toast.error("Failed to fetch purchase history (LC-wise)");
    } finally {
      setLoading(false);
    }
  };

  const groupedByLC = useMemo(() => {
    const groups: Record<string, PurchaseHistory[]> = {};
    lcHistoriesAll.forEach((ph) => {
      const lc = ph.lc_number || "No LC Number";
      if (!groups[lc]) groups[lc] = [];
      groups[lc].push(ph);
    });
    return groups;
  }, [lcHistoriesAll]);

  const lcKeys = useMemo(() => Object.keys(groupedByLC), [groupedByLC]);
  const lcTotalPages = Math.max(Math.ceil(lcKeys.length / LC_PER_PAGE), 1);
  const lcTotalItems = lcKeys.length;

  useEffect(() => {
    if (activeTab !== "lc_wise") return;
    // Clamp page if filters reduced total LC groups.
    if (currentPage > lcTotalPages) setCurrentPage(lcTotalPages);
  }, [activeTab, currentPage, lcTotalPages]);

  const pagedLcKeys = useMemo(() => {
    const start = (currentPage - 1) * LC_PER_PAGE;
    return lcKeys.slice(start, start + LC_PER_PAGE);
  }, [currentPage, lcKeys]);

  const lcPurchaseHistoriesForPage = useMemo(() => {
    const items: PurchaseHistory[] = [];
    pagedLcKeys.forEach((lcKey) => {
      items.push(...(groupedByLC[lcKey] || []));
    });
    return items;
  }, [pagedLcKeys, groupedByLC]);

  const handleCreate = () => {
    navigate("/admin/purchase-history/create", {
      state: { returnPurchaseTab: activeTab },
    });
  };

  const handleAddUnderLc = (template: PurchaseHistory) => {
    navigate("/admin/purchase-history/create", {
      state: { lcTemplate: template, returnPurchaseTab: activeTab },
    });
  };

  const handleView = (purchaseHistory: PurchaseHistory) => {
    navigate(`/admin/purchase-history/view/${purchaseHistory.id}`, {
      state: { returnPurchaseTab: activeTab },
    });
  };

  const handleEdit = (purchaseHistory: PurchaseHistory | PurchaseHistory[]) => {
    if (Array.isArray(purchaseHistory)) {
      navigate("/admin/purchase-history/edit/bulk", {
        state: { records: purchaseHistory, returnPurchaseTab: activeTab },
      });
    } else {
      navigate(`/admin/purchase-history/edit/${purchaseHistory.id}`, {
        state: { returnPurchaseTab: activeTab },
      });
    }
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
          if (activeTab === "history") {
            fetchHistoryPurchaseHistories();
          } else {
            fetchLcHistoriesAll();
          }
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
            {/* Tab Selection - LC wise first (default) */}
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setActiveTab("lc_wise");
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("tab", "lc_wise");
                    return next;
                  });
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "lc_wise"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                LC Wise View
              </button>
              <button
                onClick={() => {
                  setActiveTab("history");
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    next.set("tab", "history");
                    return next;
                  });
                }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === "history"
                  ? "bg-primary-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
                  }`}
              >
                History Table
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
                className="w-full lg:w-auto min-w-[150px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
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
                className="w-full lg:w-auto min-w-[120px] px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
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
            onRefresh={fetchHistoryPurchaseHistories}
          />
        ) : (
          <PurchaseHistoryLCView
            purchaseHistories={lcPurchaseHistoriesForPage}
            isLoading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddUnderLc={handleAddUnderLc}
          />
        )}

        {/* Pagination - same as Car page */}
        {/*
          In `lc_wise`, pagination is by LC groups (cards), not by raw purchase-history rows.
        */}
        {(() => {
          const paginationTotalPages =
            activeTab === "lc_wise" ? lcTotalPages : totalPages;
          const paginationTotalItems =
            activeTab === "lc_wise" ? lcTotalItems : totalItems;
          const paginationPerPage =
            activeTab === "lc_wise" ? LC_PER_PAGE : HISTORY_PER_PAGE;

          return (
        <Pagination
          currentPage={currentPage}
          totalPages={paginationTotalPages}
          totalItems={paginationTotalItems}
          perPage={paginationPerPage}
          onPageChange={setCurrentPage}
        />
          );
        })()}

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
