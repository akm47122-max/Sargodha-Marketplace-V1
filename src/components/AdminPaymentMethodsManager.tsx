import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  QrCode,
  AlertCircle,
  Building,
  Smartphone,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { PaymentMethod } from '../types';

interface AdminPaymentMethodsManagerProps {
  paymentMethods: PaymentMethod[];
  onSavePaymentMethod: (method: PaymentMethod) => void;
  onDeletePaymentMethod: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export const AdminPaymentMethodsManager: React.FC<AdminPaymentMethodsManagerProps> = ({
  paymentMethods,
  onSavePaymentMethod,
  onDeletePaymentMethod,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [merchantDetails, setMerchantDetails] = useState('');
  const [instructions, setInstructions] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState<number>(1);
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setEditingMethod(null);
    setName('');
    setAccountTitle('');
    setAccountNumber('');
    setMerchantDetails('');
    setInstructions(
      'Open your mobile banking or wallet app -> Select Transfer -> Enter account details -> Verify Account Title -> Send exact amount -> Save payment proof & transaction ID.'
    );
    setQrCodeUrl('');
    setIsActive(true);
    setDisplayOrder(paymentMethods.length + 1);
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setName(method.name);
    setAccountTitle(method.accountTitle);
    setAccountNumber(method.accountNumber);
    setMerchantDetails(method.merchantDetails || '');
    setInstructions(method.instructions);
    setQrCodeUrl(method.qrCodeUrl || '');
    setIsActive(method.isActive);
    setDisplayOrder(method.displayOrder || 1);
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !accountTitle.trim() || !accountNumber.trim()) {
      setError('Please provide Payment Method Name, Account Title, and Account Number.');
      return;
    }

    const updated: PaymentMethod = {
      id: editingMethod ? editingMethod.id : Date.now(),
      name: name.trim(),
      accountTitle: accountTitle.trim(),
      accountNumber: accountNumber.trim(),
      merchantDetails: merchantDetails.trim() || undefined,
      instructions: instructions.trim(),
      qrCodeUrl: qrCodeUrl.trim() || undefined,
      isActive,
      displayOrder: Number(displayOrder) || 1,
      updatedAt: new Date().toISOString(),
      createdAt: editingMethod?.createdAt || new Date().toISOString(),
    };

    onSavePaymentMethod(updated);
    setIsModalOpen(false);
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeCount = paymentMethods.filter((m) => m.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-white border border-cyan-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5 text-cyan-700" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Dynamic Payment Methods Management
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 border border-cyan-200">
              {activeCount} Active / {paymentMethods.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Configure payment methods (EasyPaisa, JazzCash, Bank Transfer, Raast). Any changes apply instantly to all user payment and advertising flows without code changes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-700/20 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Payment Method</span>
        </button>
      </div>

      {/* Methods Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-5 rounded-2xl bg-white border transition-all ${
              method.isActive
                ? 'border-cyan-200/90 shadow-sm hover:border-cyan-400'
                : 'border-slate-200 bg-slate-50/70 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    method.name.toLowerCase().includes('easypaisa')
                      ? 'bg-emerald-100 text-emerald-800'
                      : method.name.toLowerCase().includes('jazzcash')
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {method.name.toLowerCase().includes('bank') ? (
                    <Building className="w-5 h-5" />
                  ) : (
                    <Smartphone className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    {method.name}
                    {method.isActive ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-200 text-slate-600">
                        INACTIVE
                      </span>
                    )}
                  </h4>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    Title: <strong className="text-slate-800">{method.accountTitle}</strong>
                  </div>
                </div>
              </div>

              {/* Actions: Toggle Status, Edit, Delete */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleStatus(method.id)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                    method.isActive
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={method.isActive ? 'Disable Method' : 'Enable Method'}
                >
                  {method.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(method)}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                  title="Edit Payment Method"
                >
                  <Edit2 className="w-4 h-4 text-cyan-700" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete payment method "${method.name}"?`)) {
                      onDeletePaymentMethod(method.id);
                    }
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors"
                  title="Delete Payment Method"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Account Details Box */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Account / Mobile / IBAN:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-cyan-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {method.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopy(method.id, method.accountNumber)}
                    className="p-1 text-slate-400 hover:text-cyan-700 transition-colors"
                    title="Copy Number"
                  >
                    {copiedId === method.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {method.merchantDetails && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Merchant / Branch:</span>
                  <span className="font-semibold text-slate-800">{method.merchantDetails}</span>
                </div>
              )}
            </div>

            {/* Instructions snippet */}
            <div className="mt-3 text-[11px] text-slate-600 line-clamp-2 italic">
              "{method.instructions}"
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Payment Method Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-700" />
                <span>{editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Payment Method Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. EasyPaisa, JazzCash, Meezan Bank, SadaPay, Raast"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Account Title / Holder *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Muhammad Akram Tayyab"
                    value={accountTitle}
                    onChange={(e) => setAccountTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Account Number / Mobile / IBAN *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 03127453108 or PK64MEZN..."
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Merchant Details / Branch / Till ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Till #8821, Satellite Town Sargodha Branch"
                  value={merchantDetails}
                  onChange={(e) => setMerchantDetails(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Customer Payment Instructions *
                </label>
                <textarea
                  rows={3}
                  placeholder="Step-by-step guidance for user to complete the transfer..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Optional QR Image URL / Custom Asset
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://... or leave blank for automatic dynamic QR"
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">Active Status</div>
                  <div className="text-[10px] text-slate-500">
                    When active, customers will see this option on payment screens
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-700 hover:bg-cyan-600 text-white shadow-md shadow-cyan-700/20"
                >
                  {editingMethod ? 'Save Changes' : 'Create Payment Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
