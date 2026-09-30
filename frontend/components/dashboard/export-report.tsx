'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { saleService } from '@/services/sale.service';
import { Sale } from '@/types/sale';

function csvCell(value: string | number) {
  const text = String(value);
  const safeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

function dateKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export default function ExportReport() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const exportReport = async () => {
    if (fromDate && toDate && fromDate > toDate) {
      setError('Start date must be on or before end date.');
      return;
    }

    setExporting(true);
    setError('');

    try {
      const firstPage = await saleService.getSales({ page: 1, limit: 100 });
      const sales: Sale[] = [...firstPage.data];

      for (let page = 2; page <= firstPage.meta.totalPages; page += 1) {
        const response = await saleService.getSales({ page, limit: 100 });
        sales.push(...response.data);
      }

      const filteredSales = sales.filter((sale) => {
        const date = dateKey(sale.purchaseDate);
        return (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
      });

      if (filteredSales.length === 0) {
        setError('No invoices were found for the selected date range.');
        return;
      }

      const paidSales = filteredSales.filter((sale) => sale.paymentStatus === 'PAID');
      const unpaidSales = filteredSales.filter((sale) => sale.paymentStatus !== 'PAID');
      const paidAmount = paidSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);
      const unpaidAmount = unpaidSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0);

      const rows: (string | number)[][] = [
        ['Payment Report'],
        ['Period', `${fromDate || 'All dates'} to ${toDate || 'All dates'}`],
        [],
        ['Payment Summary', 'Count', 'Amount (INR)'],
        ['All invoices', filteredSales.length, filteredSales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0).toFixed(2)],
        ['Paid', paidSales.length, paidAmount.toFixed(2)],
        ['Unpaid', unpaidSales.length, unpaidAmount.toFixed(2)],
        [],
        ['Invoice Number', 'Invoice Date', 'Customer', 'Phone', 'Item', 'Quantity', 'Unit Price (INR)', 'Line Total (INR)', 'Discount (INR)', 'Invoice Total (INR)', 'Payment Status', 'Paid Amount (INR)', 'Unpaid Amount (INR)'],
        ...filteredSales.flatMap((sale) => {
          const isPaid = sale.paymentStatus === 'PAID';
          const items = Array.isArray(sale.items) ? sale.items : [];
          const invoiceRows = items.length > 0 ? items : [null];

          return invoiceRows.map((item, index) => {
            const isFirstItem = index === 0;
            return [
              sale.purchaseNumber,
              dateKey(sale.purchaseDate),
              sale.contact ? `${sale.contact.firstName} ${sale.contact.lastName}` : 'Customer',
              sale.contact?.phone || '',
              item?.product?.name || '',
              item?.quantity ?? '',
              item ? Number(item.unitPrice).toFixed(2) : '',
              item ? Number(item.totalPrice).toFixed(2) : '',
              isFirstItem ? Number(sale.discount).toFixed(2) : '',
              isFirstItem ? Number(sale.totalAmount).toFixed(2) : '',
              isFirstItem ? (isPaid ? 'Paid' : 'Unpaid') : '',
              isFirstItem ? (isPaid ? Number(sale.totalAmount).toFixed(2) : '0.00') : '',
              isFirstItem ? (isPaid ? '0.00' : Number(sale.totalAmount).toFixed(2)) : '',
            ];
          });
        }),
      ];

      const csv = `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}`;
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `payment-report-${fromDate || 'all'}-to-${toDate || 'all'}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to export the report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="text-left text-xs font-medium text-slate-600">From date<input aria-label="From date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800" /></label>
      <label className="text-left text-xs font-medium text-slate-600">To date<input aria-label="To date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="mt-1 block rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800" /></label>
      <button type="button" onClick={exportReport} disabled={exporting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
        <Download className="h-4 w-4" /> {exporting ? 'Preparing…' : 'Export'}
      </button>
      {error && <p role="alert" className="basis-full text-right text-sm text-red-600">{error}</p>}
    </div>
  );
}
