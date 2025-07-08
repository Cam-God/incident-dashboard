import { useEffect, useState } from "react";
import Pagination from "./Pagniation";

function LogsTable() {
  const [logs, setLogs] = useState([]);
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const LOGS_PER_PAGE = 10;

  useEffect(() => {
    fetch("/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []));

    const socket = new WebSocket("ws://localhost:8000/ws/logs");

    socket.onmessage = (event) => {
      const newLog = JSON.parse(event.data);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    socket.onopen = () => console.log("WebSocket connected");
    socket.onclose = () => console.log("WebSocket disconnected");

    return () => socket.close();
  }, []);

  // Update displayedLogs when logs or page changes
  useEffect(() => {
    const start = (currentPage - 1) * LOGS_PER_PAGE;
    const end = start + LOGS_PER_PAGE;
    setDisplayedLogs(logs.slice(start, end));
  }, [logs, currentPage]);

  const totalPages = Math.ceil(logs.length / LOGS_PER_PAGE);

  return (
    <div className="p-1">
      <h2 className="text-xl font-bold mb-2">All Logs</h2>
      {logs.length === 0 ? (
        <p className="text-gray-600">No logs available</p>
      ) : (
        <div className="table-section">
          <table className="table-auto w-full border">
            <thead>
              <tr>
                <th className="border px-1 py-1 border-gray-500 text-sm">
                  Timestamp
                </th>
                <th className="border px-1 py-1 border-gray-500 text-sm">
                  Service
                </th>
                <th className="border px-1 py-1 border-gray-500 text-sm">
                  Level
                </th>
                <th className="border px-1 py-1 border-gray-500 text-sm">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedLogs.map((log, index) => (
                <tr key={index}>
                  <td className="border px-1 border-gray-500 text-sm">
                    {log.timestamp}
                  </td>
                  <td className="border px-1 border-gray-500 text-sm">
                    {log.service}
                  </td>
                  <td className="border px-1 border-gray-500 text-sm">
                    {log.level}
                  </td>
                  <td className="border px-1 border-gray-500 text-sm">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default LogsTable;
