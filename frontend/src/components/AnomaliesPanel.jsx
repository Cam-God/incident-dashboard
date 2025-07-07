import { useEffect, useState } from "react";

function AnomaliesPanel() {
  const [anomalies, setAnomalies] = useState([]);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const LOGS_PER_PAGE = 10;
  const totalPages = Math.ceil(anomalies.length / LOGS_PER_PAGE);

  useEffect(() => {
    fetch("/anomalies")
      .then((res) => res.json())
      .then((data) => setAnomalies(data.anomalies || []));

    const socket = new WebSocket("ws://localhost:8000/ws/logs");

    socket.onmessage = (event) => {
      const newLog = JSON.parse(event.data);

      if (newLog.flag) {
        setAnomalies((prev) => [...prev, newLog]);
      }
    };

    socket.onopen = () => console.log("WebSocket connected to anomalies panel");
    socket.onclose = () =>
      console.log("WebSocket disconnected from anomalies panel");

    return () => socket.close();
  }, []);

  // Update displayedLogs when logs or page changes
  useEffect(() => {
    const start = (currentPage - 1) * LOGS_PER_PAGE;
    const end = start + LOGS_PER_PAGE;
    setDisplayedLogs(anomalies.slice(start, end));
  }, [anomalies, currentPage]);

  const handlePage = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="p-2 mt-6 border border-red-500 rounded">
      <h2 className="text-xl font-bold text-red-700 mb-2">Anomalies</h2>
      {anomalies.length === 0 ? (
        <p className="text-gray-600">No anomalies detected.</p>
      ) : (
        <div className="table-section">
          <table className="table-auto w-full border border-red-500">
            <thead>
              <tr>
                <th className="border px-1 py-1 border-red-300 small-text">
                  Timestamp
                </th>
                <th className="border px-1 py-1 border-red-300 small-text">
                  Service
                </th>
                <th className="border px-1 py-1 border-red-300 small-text">
                  Level
                </th>
                <th className="border px-1 py-1 border-red-300 small-text">
                  Flag
                </th>
                <th className="border px-1 py-1 border-red-300 small-text">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs &&
                displayedLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="border px-1 border-red-300 small-text">
                      {log.timestamp}
                    </td>
                    <td className="border px-1 border-red-300 small-text">
                      {log.service}
                    </td>
                    <td className="border px-1 border-red-300 small-text">
                      {log.level}
                    </td>
                    <td className="border px-1 font-semibold text-red-500 border-red-300 small-text">
                      {log.flag || "No flag in scope"}
                    </td>
                    <td className="border px-1 font-semibold text-red-500 border-red-300 small-text">
                      {log.message}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="page-section">
              <div onClick={() => handlePage("prev")} className="page-arrow">
                &lt;
              </div>
              {currentPage > 1 && (
                <div
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="page-number"
                >
                  {currentPage - 1}
                </div>
              )}
              <div className="page-number current-page-number">
                {currentPage}
              </div>
              {totalPages > currentPage && (
                <div
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="page-number"
                >
                  {currentPage + 1}
                </div>
              )}
              <div
                onClick={() => handlePage("next")}
                disabled={currentPage === totalPages}
                className="page-arrow"
              >
                &gt;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnomaliesPanel;
