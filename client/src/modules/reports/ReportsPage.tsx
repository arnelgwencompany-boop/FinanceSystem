import { useState, useMemo, useRef } from "react";
import ReportsHeader from "../../components/reports/ReportHeader";
import FilterPanel from "../../components/reports/Filterpanel";
import ReportPreview from "../../components/reports/Reportpreview";
import { MOCK_TRANSACTIONS } from "../../data/reportData";

export default function Reports() {
  const [startDate, setStartDate]   = useState("");
  const [endDate, setEndDate]       = useState("");
  const [category, setCategory]     = useState("All Categories");
  const [refreshKey, setRefreshKey] = useState(0);

  const printRef = useRef<HTMLDivElement>(null!);

  // Filter logic
  const filteredData = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((item) => {
      const matchDate =
        !startDate || !endDate
          ? true
          : item.date >= startDate && item.date <= endDate;
      const matchCategory =
        category === "All Categories" ? true : item.category === category;
      return matchDate && matchCategory;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, category, refreshKey]);

  const totalAmount = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.amount, 0),
    [filteredData]
  );

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredData.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    });
    return grouped;
  }, [filteredData]);

  // Print handler — opens clean window with only the report content
  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank", "width=1000,height=800");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head><title>Expenditure Report</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 13px; color: #191c1e; padding: 32px; }
        table { width: 100%; border-collapse: collapse; }
        td, th { border: 1px solid #c2c7d1; padding: 8px 12px; }
        th { background: #f2f4f6; font-weight: bold; }
        .text-right { text-align: right; }
        @page { margin: 1.5cm; }
      </style></head>
      <body>${printRef.current.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <main className="ml-[240px] mt-16 p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1740px] mx-auto space-y-6">

        <ReportsHeader onPrint={handlePrint} />

        <FilterPanel
          startDate={startDate}
          endDate={endDate}
          category={category}
          onStartDate={setStartDate}
          onEndDate={setEndDate}
          onCategory={setCategory}
          onRefresh={() => setRefreshKey((k) => k + 1)}
        />

        <ReportPreview
          filteredData={filteredData}
          totalAmount={totalAmount}
          groupedByCategory={groupedByCategory}
          printRef={printRef}
        />

      </div>
    </main>
  );
}