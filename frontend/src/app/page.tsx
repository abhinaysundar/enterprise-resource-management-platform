"use client";

import React, { useState, useEffect } from 'react';

// DTO Interfaces
interface ResourceAllocationResponseDTO {
  id: number;
  resourceName: string;
  resourceType: string;
  allocationAmount: number;
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  departmentName: string;
  departmentCode: string;
}

interface ValidationErrorResponse {
  message: string;
  errorCode: string;
  validationErrors?: Record<string, string>;
}

export default function DashboardPage() {
  // State management
  const [allocations, setAllocations] = useState<ResourceAllocationResponseDTO[]>([]);
  const [filteredAllocations, setFilteredAllocations] = useState<ResourceAllocationResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formEmployeeId, setFormEmployeeId] = useState<string>('10'); // Default matching our seed Employee
  const [formResourceName, setFormResourceName] = useState<string>('');
  const [formResourceType, setFormResourceType] = useState<string>('CLOUD_COMPUTE');
  const [formAllocationAmount, setFormAllocationAmount] = useState<number>(50);
  const [formStartDate, setFormStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState<string>('');
  const [formStatus, setFormStatus] = useState<string>('ACTIVE');

  // Fetch all allocations
  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetching through Next.js rewrite proxy to avoid CORS
      const res = await fetch('/api/v1/resource-allocations');
      if (!res.ok) {
        throw new Error(`Failed to fetch allocations: ${res.statusText}`);
      }
      const data: ResourceAllocationResponseDTO[] = await res.json();
      setAllocations(data);
      setFilteredAllocations(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while loading dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Handle client-side search and filtering
  useEffect(() => {
    let result = allocations;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.resourceName.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.departmentName.toLowerCase().includes(q) ||
        item.departmentCode.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter(item => item.status === statusFilter);
    }

    if (typeFilter !== 'ALL') {
      result = result.filter(item => item.resourceType === typeFilter);
    }

    setFilteredAllocations(result);
  }, [searchQuery, statusFilter, typeFilter, allocations]);

  // Handle allocation deletion
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to release this resource allocation?')) return;
    try {
      const res = await fetch(`/api/v1/resource-allocations/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete allocation');
      }
      // Reload lists
      fetchAllocations();
    } catch (err: any) {
      alert(err.message || 'Error occurred while releasing resource allocation.');
    }
  };

  // Handle modal submit creation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});
    setSubmitting(true);

    const payload = {
      resourceName: formResourceName,
      resourceType: formResourceType,
      allocationAmount: Number(formAllocationAmount),
      startDate: formStartDate,
      endDate: formEndDate === '' ? null : formEndDate,
      status: formStatus,
      employeeId: Number(formEmployeeId)
    };

    try {
      const res = await fetch('/api/v1/resource-allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData: ValidationErrorResponse = await res.json();
        if (errData.validationErrors) {
          setFieldErrors(errData.validationErrors);
          throw new Error('Validation failed. Please correct fields.');
        } else {
          throw new Error(errData.message || 'Failed to submit resource allocation request.');
        }
      }

      // Success
      setIsModalOpen(false);
      // Reset form
      setFormResourceName('');
      setFormAllocationAmount(50);
      setFormEndDate('');
      // Refresh statistics
      fetchAllocations();
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculation
  const totalCount = allocations.length;
  const activeCount = allocations.filter(a => a.status === 'ACTIVE').length;
  const avgLoad = totalCount > 0 
    ? Math.round(allocations.reduce((sum, item) => sum + item.allocationAmount, 0) / totalCount) 
    : 0;

  return (
    <main className="flex-1 bg-slate-950 text-slate-100 min-h-screen overflow-x-hidden relative flex flex-col justify-between font-sans">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header bar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-sky-500/20">
            Ω
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              OmniERM
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            Spring Session Connected
          </span>
        </div>
      </header>

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto w-full px-6 py-10 flex-1 flex flex-col gap-8">
        
        {/* Dash title & create button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Resource Allocations</h2>
            <p className="text-slate-400 text-sm mt-1">Manage cloud workspaces, hardware distributions, and staffing metrics.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-all text-white font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-sky-500/10"
          >
            {/* SVG Plus Icon */}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Request Allocation
          </button>
        </div>

        {/* Loading / Error fallbacks */}
        {loading && allocations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-900 rounded-2xl">
            <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Synchronizing ERM metrics database...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-semibold mb-2">Sync Connection Error</p>
            <p className="text-slate-400 text-sm mb-4">{error}</p>
            <button 
              onClick={fetchAllocations}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs px-4 py-2 rounded-lg font-semibold text-white transition-all"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <>
            {/* KPI Metrics Dashboard Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Allocated Items</span>
                <p className="text-4xl font-extrabold text-white mt-3">{totalCount}</p>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Operations</span>
                <p className="text-4xl font-extrabold text-emerald-400 mt-3">{activeCount}</p>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${totalCount > 0 ? (activeCount / totalCount) * 100 : 0}%` }} 
                  />
                </div>
              </div>
              <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg Allocated Load</span>
                <p className="text-4xl font-extrabold text-violet-400 mt-3">{avgLoad}%</p>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div 
                    className="bg-violet-500 h-full rounded-full transition-all" 
                    style={{ width: `${avgLoad}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Filter and Search Layout Controls */}
            <div className="bg-slate-900/20 border border-slate-900 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search query input */}
              <div className="relative w-full lg:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  {/* SVG Search */}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search allocations, employee or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-all"
                />
              </div>

              {/* Status and Type filter picks */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all flex-1 sm:flex-initial"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type:</span>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all flex-1 sm:flex-initial"
                  >
                    <option value="ALL">All Types</option>
                    <option value="CLOUD_COMPUTE">CLOUD_COMPUTE</option>
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interactive HTML5 Data Table Container */}
            <div className="bg-slate-900/40 border border-slate-900 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-950/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Allocated Resource</th>
                      <th className="px-6 py-4">Resource Type</th>
                      <th className="px-6 py-4">Allocation Load</th>
                      <th className="px-6 py-4">Assigned Personnel</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Timeline</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60 text-sm">
                    {filteredAllocations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                          No resource allocations match the filters.
                        </td>
                      </tr>
                    ) : (
                      filteredAllocations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                          {/* Resource Name */}
                          <td className="px-6 py-4.5 font-semibold text-white">
                            {item.resourceName}
                          </td>
                          {/* Type badge */}
                          <td className="px-6 py-4.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.resourceType === 'CLOUD_COMPUTE' 
                                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                                : item.resourceType === 'HARDWARE'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            }`}>
                              {item.resourceType}
                            </span>
                          </td>
                          {/* Allocation amount progress load */}
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3">
                              <span className="w-9 text-slate-300 font-mono text-xs">{item.allocationAmount}%</span>
                              <div className="w-24 bg-slate-950 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    item.allocationAmount > 80 
                                      ? 'bg-rose-500' 
                                      : item.allocationAmount > 50 
                                      ? 'bg-violet-500' 
                                      : 'bg-sky-500'
                                  }`} 
                                  style={{ width: `${item.allocationAmount}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          {/* Personnel details */}
                          <td className="px-6 py-4.5">
                            <div>
                              <p className="font-semibold text-slate-200">{item.employeeName}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{item.employeeEmail}</p>
                            </div>
                          </td>
                          {/* Department representation */}
                          <td className="px-6 py-4.5">
                            <div>
                              <p className="font-medium text-slate-300">{item.departmentName}</p>
                              <p className="text-slate-500 text-xs font-mono mt-0.5">{item.departmentCode}</p>
                            </div>
                          </td>
                          {/* Start -> End Date */}
                          <td className="px-6 py-4.5 font-mono text-xs text-slate-400">
                            <div className="flex flex-col gap-0.5">
                              <span>S: {item.startDate}</span>
                              <span className="text-[10px] text-slate-500">
                                E: {item.endDate ? item.endDate : 'INDEFINITE'}
                              </span>
                            </div>
                          </td>
                          {/* Status badge */}
                          <td className="px-6 py-4.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              item.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : item.status === 'COMPLETED'
                                ? 'bg-slate-500/10 text-slate-400 border border-slate-800'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                              }`} />
                              {item.status}
                            </span>
                          </td>
                          {/* Release Delete Action */}
                          <td className="px-6 py-4.5 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all"
                              title="Release Allocation"
                            >
                              {/* SVG Trash Icon */}
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FOOTER BAR */}
      <footer className="border-t border-slate-900 bg-slate-950/20 px-6 py-6 text-slate-600 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Enterprise Resource Management Platform. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-500 transition-colors">Privacy Agreement</a>
          <a href="#" className="hover:text-slate-500 transition-colors">SLA Standards</a>
        </div>
      </footer>

      {/* NEW RESOURCE ALLOCATION MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/40">
              <div>
                <h3 className="text-lg font-bold text-white">New Allocation Request</h3>
                <p className="text-xs text-slate-400 mt-0.5">Assign cloud resources or computing machines to personnel.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-800/50 transition-all"
              >
                {/* SVG Close */}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form content */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {submitError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl font-medium">
                  {submitError}
                </div>
              )}

              {/* Resource Name input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS EC2 GPU Sandbox, MacBook Pro 16"
                  value={formResourceName}
                  onChange={(e) => setFormResourceName(e.target.value)}
                  className={`bg-slate-950 border ${fieldErrors.resourceName ? 'border-red-500/60' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-all`}
                />
                {fieldErrors.resourceName && (
                  <span className="text-[10px] text-red-400 font-semibold">{fieldErrors.resourceName}</span>
                )}
              </div>

              {/* Resource Type & Employee ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resource Type</label>
                  <select
                    value={formResourceType}
                    onChange={(e) => setFormResourceType(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all"
                  >
                    <option value="CLOUD_COMPUTE">CLOUD_COMPUTE</option>
                    <option value="HARDWARE">HARDWARE</option>
                    <option value="SOFTWARE">SOFTWARE</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Employee ID</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 10"
                    value={formEmployeeId}
                    onChange={(e) => setFormEmployeeId(e.target.value)}
                    className={`bg-slate-950 border ${fieldErrors.employeeId ? 'border-red-500/60' : 'border-slate-800'} rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500/50 transition-all`}
                  />
                  {fieldErrors.employeeId && (
                    <span className="text-[10px] text-red-400 font-semibold">{fieldErrors.employeeId}</span>
                  )}
                </div>
              </div>

              {/* Allocation Amount range bar slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allocation Load Percentage</label>
                  <span className="text-sm font-bold text-sky-400 font-mono">{formAllocationAmount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formAllocationAmount}
                  onChange={(e) => setFormAllocationAmount(Number(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer appearance-none mt-2"
                />
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className={`bg-slate-950 border ${fieldErrors.startDate ? 'border-red-500/60' : 'border-slate-800'} rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all`}
                  />
                  {fieldErrors.startDate && (
                    <span className="text-[10px] text-red-400 font-semibold">{fieldErrors.startDate}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Status configuration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allocation Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-sky-500/50 transition-all"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-950 border border-slate-800 text-xs px-5 py-3 rounded-xl font-semibold text-slate-400 hover:text-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 transition-all text-white font-semibold text-xs px-5 py-3 rounded-xl shadow-lg shadow-sky-500/10"
                >
                  {submitting && (
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  )}
                  Submit Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
