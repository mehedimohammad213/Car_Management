import React, { useState, useMemo } from "react";
import { PurchaseHistory } from "../../services/purchaseHistoryApi";
import {
    FileText,
    Car,
    ChevronRight,
    ChevronDown,
    Calendar,
    Database,
    Building2,
    ArrowRight,
    Info
} from "lucide-react";

interface PurchaseHistoryLCViewProps {
    purchaseHistories: PurchaseHistory[];
    isLoading: boolean;
    onView?: (purchaseHistory: PurchaseHistory) => void;
}

const PurchaseHistoryLCView: React.FC<PurchaseHistoryLCViewProps> = ({
    purchaseHistories,
    isLoading,
    onView,
}) => {
    const [expandedLC, setExpandedLC] = useState<string | null>(null);

    const groupedByLC = useMemo(() => {
        const groups: Record<string, PurchaseHistory[]> = {};
        purchaseHistories.forEach((ph) => {
            const lc = ph.lc_number || "No LC Number";
            if (!groups[lc]) {
                groups[lc] = [];
            }
            groups[lc].push(ph);
        });
        return groups;
    }, [purchaseHistories]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                        <div className="flex justify-between items-center">
                            <div className="space-y-3 w-1/3">
                                <div className="h-6 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded-full w-24"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (Object.keys(groupedByLC).length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                <Database className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No LC Records Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Object.entries(groupedByLC).map(([lcNumber, histories]) => {
                const isExpanded = expandedLC === lcNumber;
                const totalCars = histories.reduce((acc, curr) => acc + (curr.cars?.length || (curr.car ? 1 : 0)), 0);

                return (
                    <div
                        key={lcNumber}
                        className={`group bg-white rounded-2xl shadow-md border-2 transition-all duration-300 overflow-hidden ${isExpanded
                            ? "border-primary-500 shadow-xl ring-4 ring-primary-50"
                            : "border-transparent hover:border-primary-200 hover:shadow-lg"
                            }`}
                    >
                        {/* LC Header Card */}
                        <div
                            className={`p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isExpanded ? "bg-primary-50/50" : "hover:bg-slate-50"
                                }`}
                            onClick={() => setExpandedLC(isExpanded ? null : lcNumber)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-4 rounded-2xl transition-all duration-300 ${isExpanded ? "bg-primary-600 text-white rotate-12 scale-110 shadow-lg" : "bg-primary-50 text-primary-600 group-hover:scale-110"
                                    }`}>
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {lcNumber}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                            <Building2 className="w-4 h-4 text-primary-500" />
                                            {histories[0].lc_bank_name || "N/A Bank"}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                            <Calendar className="w-4 h-4 text-primary-500" />
                                            LC: {histories[0].lc_date ? new Date(histories[0].lc_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                                            <Car className="w-4 h-4 text-primary-500" />
                                            {totalCars} Vehicles
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 ml-auto md:ml-0">
                                <div className="hidden sm:flex flex-col items-end mr-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Entries</span>
                                    <span className="text-lg font-black text-primary-600">{histories.length}</span>
                                </div>
                                <button
                                    className={`p-3 rounded-xl transition-all duration-500 ${isExpanded ? "bg-primary-600 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-primary-100 group-hover:text-primary-500"
                                        }`}
                                >
                                    <ChevronDown className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Car List - Expandable Section */}
                        {isExpanded && (
                            <div className="bg-slate-50 border-t border-primary-100 animate-in slide-in-from-top-4 duration-500">
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                            <Car className="w-5 h-5 text-primary-500" />
                                            Vehicles under LC: {lcNumber}
                                        </h4>
                                        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                                            Found {totalCars} cars
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {histories.map((history) => {
                                            const cars = history.cars || (history.car ? [history.car] : []);
                                            return cars.map((car, idx) => (
                                                <div
                                                    key={`${history.id}-${idx}`}
                                                    className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-xl hover:border-primary-300 transition-all duration-300 group/car relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 right-0 p-1 bg-primary-50 text-primary-600 rounded-bl-xl opacity-0 group-hover/car:opacity-100 transition-opacity">
                                                        <Info className="w-4 h-4" />
                                                    </div>

                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="min-w-0 flex-1">
                                                            <h5 className="font-bold text-gray-900 text-lg group-hover/car:text-primary-600 transition-colors truncate">
                                                                {car.make} {car.model}
                                                            </h5>
                                                            <div className="text-xs text-gray-500 font-bold uppercase tracking-tighter mt-0.5">
                                                                REF: {car.ref_no || "N/A"}
                                                            </div>
                                                        </div>
                                                        <div className="bg-primary-50 p-2.5 rounded-xl text-primary-500 ml-4">
                                                            <Car className="w-5 h-5 shadow-sm" />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-xl border border-gray-100">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-400 uppercase">Chassis</span>
                                                            <span className="text-sm font-mono font-bold text-gray-800">
                                                                {car.chassis_no_full || car.chassis_no_masked || "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-400 uppercase">LC Date</span>
                                                            <span className="text-sm font-bold text-gray-700">
                                                                {history.lc_date ? new Date(history.lc_date).toLocaleDateString("en-US", {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                }) : "N/A"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-400 uppercase">Purchase Date</span>
                                                            <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-primary-400" />
                                                                {history.purchase_date ? new Date(history.purchase_date).toLocaleDateString("en-US", {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                }) : "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => onView?.(history)}
                                                        className="w-full py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        Full History Details
                                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            ));
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default PurchaseHistoryLCView;
