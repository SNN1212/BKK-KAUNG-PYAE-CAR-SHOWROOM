"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function toNumber(value) {
  const n = typeof value === "string" ? Number(value.replace(/,/g, "")) : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatDateInput(value) {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateDisplay(value) {
  if (!value) return "N/A";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return String(value);
  return dt.toLocaleDateString("en-GB");
}

export default function MoneyManagerPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [selectedPeriod, setSelectedPeriod] = useState("monthly"); // monthly | sixMonths | yearly
  const apiPeriod = useMemo(
    () => (selectedPeriod === "sixMonths" ? "6months" : selectedPeriod),
    [selectedPeriod]
  );

  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [expensesDateRange, setExpensesDateRange] = useState(null);

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    description: "",
    amount: "",
    expenseDate: formatDateInput(new Date()),
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const authHeaders = useMemo(() => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const handleLogout = () => {
    window.location.href = "/admin/login";
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setExpenseForm({
      title: "",
      description: "",
      amount: "",
      expenseDate: formatDateInput(new Date()),
    });
    setFormError("");
    setShowExpenseModal(true);
  };

  const openEditModal = (exp) => {
    setEditingExpense(exp);
    setExpenseForm({
      title: exp?.title || "",
      description: exp?.description || "",
      amount: String(exp?.amount ?? ""),
      expenseDate: formatDateInput(exp?.expenseDate || exp?.date || exp?.createdAt),
    });
    setFormError("");
    setShowExpenseModal(true);
  };

  const closeModal = () => {
    if (saving) return;
    setShowExpenseModal(false);
    setEditingExpense(null);
    setFormError("");
  };

  const fetchAll = async () => {
    if (!API_BASE_URL) {
      console.warn("API base URL is not set. Cannot fetch money manager data.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const expRes = await fetch(`${API_BASE_URL}/api/general-expenses/period?period=${apiPeriod}`, {
        cache: "no-store",
        headers: authHeaders,
      });

      if (expRes.status === 401) {
        alert("Unauthorized: Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      if (!expRes.ok) {
        const t = await expRes.text().catch(() => "");
        throw new Error(`Expenses request failed (${expRes.status}). ${t}`);
      }

      const expJson = await expRes.json();

      setExpenses(Array.isArray(expJson?.data) ? expJson.data : []);
      setExpensesDateRange(expJson?.dateRange || null);

      setLoading(false);
    } catch (e) {
      console.error("Money manager load failed:", e);
      alert(`Failed to load money manager data: ${e.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, apiPeriod]);

  const handleSaveExpense = async (e) => {
    e.preventDefault();

    setFormError("");

    const title = (expenseForm.title || "").trim();
    const description = (expenseForm.description || "").trim();
    const amount = toNumber(expenseForm.amount);
    const expenseDate = expenseForm.expenseDate;

    if (!title) {
      setFormError("Title is required.");
      return;
    }
    if (!expenseDate) {
      setFormError("Expense date is required.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    if (!API_BASE_URL) {
      setFormError("API base URL is not configured.");
      return;
    }

    try {
      setSaving(true);

      const isEdit = Boolean(editingExpense?._id || editingExpense?.id);
      const id = editingExpense?._id || editingExpense?.id;

      if (isEdit) {
        const ok = window.confirm(`Update this expense?\n\n${title}\n฿${amount.toLocaleString()}`);
        if (!ok) return;
      }

      const url = isEdit
        ? `${API_BASE_URL}/api/general-expenses/${id}`
        : `${API_BASE_URL}/api/general-expenses`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          amount,
          expenseDate,
        }),
      });

      if (res.status === 401) {
        alert("Unauthorized: Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || `Request failed (${res.status})`);
      }

      closeModal();
      await fetchAll();
    } catch (err) {
      console.error("Save expense failed:", err);
      setFormError(err.message || "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (exp) => {
    if (!exp) return;
    const ok = window.confirm(
      `Delete this expense?\n\n${exp?.title || "Untitled"}\n฿${toNumber(exp?.amount).toLocaleString()}`
    );
    if (!ok) return;

    const id = exp?._id || exp?.id;
    if (!id) return;

    if (!API_BASE_URL) {
      alert("API base URL is not configured.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/general-expenses/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (res.status === 401) {
        alert("Unauthorized: Please login again.");
        window.location.href = "/admin/login";
        return;
      }

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || `Delete failed (${res.status})`);
      }

      await fetchAll();
    } catch (err) {
      console.error("Delete expense failed:", err);
      alert(`Failed to delete expense: ${err.message}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/View.png')" }}
    >
      {/* Top Navigation Bar */}
      <nav className="bg-black/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">BKK KAUNG PYAE CAR SHOWROOM</h1>
            <button
              onClick={handleLogout}
              className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-red-500 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <nav className="bg-black/70 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-nowrap space-x-4 sm:space-x-8 h-12 sm:h-14 overflow-x-auto scrollbar-hide">
            <Link
              href="/admin/dashboard"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Car List
            </Link>
            <Link
              href="/admin/installments"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Installments
            </Link>
            <Link
              href="/admin/installment-calculator"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Installment Calculator
            </Link>
            <Link
              href="/admin/sold-list"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Sold List
            </Link>
            <Link
              href="/admin/analysis"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Analysis
            </Link>
            <Link
              href="/admin/installment-analysis"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-white hover:text-red-500 hover:border-red-500 border-b-2 border-transparent whitespace-nowrap flex-shrink-0"
            >
              Installment Analysis
            </Link>
            <Link
              href="/admin/money-manager"
              className="flex items-center px-2 sm:px-3 py-2 text-sm sm:text-base font-medium text-red-500 border-b-2 border-red-500 whitespace-nowrap flex-shrink-0"
            >
              Money Manager
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-6 lg:px-8">
        <div className="px-2 sm:px-4 py-4 sm:py-6 sm:px-0">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Money Manager</h2>
              <div className="text-sm sm:text-base text-gray-300 mt-1">
                Period:{" "}
                <span className="font-medium text-white">
                  {selectedPeriod === "sixMonths" ? "6 Months" : selectedPeriod}
                </span>
                {expensesDateRange?.startDate && expensesDateRange?.endDate ? (
                  <span className="ml-2">
                    ({formatDateDisplay(expensesDateRange.startDate)} -{" "}
                    {formatDateDisplay(expensesDateRange.endDate)})
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
              {/* Period Selection */}
              <div className="flex bg-black/30 backdrop-blur-md rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedPeriod("monthly")}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all cursor-pointer ${
                    selectedPeriod === "monthly" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPeriod("sixMonths")}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all cursor-pointer ${
                    selectedPeriod === "sixMonths" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  6 Months
                </button>
                <button
                  onClick={() => setSelectedPeriod("yearly")}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium rounded-md transition-all cursor-pointer ${
                    selectedPeriod === "yearly" ? "bg-red-600 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  Yearly
                </button>
              </div>

              <button
                onClick={openCreateModal}
                className="bg-black/20 backdrop-blur-md text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-black/30 hover:text-green-400 text-base sm:text-lg font-medium border border-white/30 transition-all duration-200 cursor-pointer w-full sm:w-auto"
              >
                + Add Expense
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-white text-xl">Loading money manager...</div>
          ) : (
            <>
              {/* Expenses Table */}
              <div className="bg-black/20 backdrop-blur-2xl shadow overflow-hidden sm:rounded-md">
                <div className="px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">General Expenses</h3>
                  <div className="text-sm text-gray-300">
                    Showing{" "}
                    <span className="font-numeric text-white">{Array.isArray(expenses) ? expenses.length : 0}</span>{" "}
                    items
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-600">
                    <thead className="bg-black/20 backdrop-blur-2xl">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-white uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-bold text-white uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-black/10 backdrop-blur-2xl divide-y divide-gray-600">
                      {(!Array.isArray(expenses) || expenses.length === 0) && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-white">
                            No expenses found for this period.
                          </td>
                        </tr>
                      )}

                      {(expenses || []).map((exp, idx) => (
                        <tr key={exp?._id || exp?.id || idx} className="hover:bg-black/30">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                            {formatDateDisplay(exp?.expenseDate || exp?.date || exp?.createdAt)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-medium">
                            {exp?.title || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-200 max-w-[520px]">
                            <div className="line-clamp-2">{exp?.description || "-"}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white text-right font-numeric font-semibold">
                            ฿{toNumber(exp?.amount).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-white">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(exp)}
                                className="bg-black/20 backdrop-blur-md text-white px-3 py-1.5 rounded hover:bg-black/30 hover:text-blue-400 font-medium border border-white/30 transition-all duration-200 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(exp)}
                                className="bg-black/20 backdrop-blur-md text-white px-3 py-1.5 rounded hover:bg-black/30 hover:text-red-400 font-medium border border-white/30 transition-all duration-200 cursor-pointer"
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-100 rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </h3>

              {formError ? <div className="mb-3 text-sm text-red-700">{formError}</div> : null}

              <form onSubmit={handleSaveExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={expenseForm.title}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g., Office Rent - February"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Add context for this expense..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    maxLength={1000}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="500000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-numeric"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expense Date</label>
                    <input
                      type="date"
                      value={expenseForm.expenseDate}
                      onChange={(e) => setExpenseForm((p) => ({ ...p, expenseDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-numeric"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 hover:text-red-500 font-medium cursor-pointer disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 hover:text-red-200 font-medium cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Saving..." : editingExpense ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

