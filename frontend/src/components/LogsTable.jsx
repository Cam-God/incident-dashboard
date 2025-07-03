import { useEffect, useState } from "react";

function LogsTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data.logs || []));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">All Logs</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Timestamp</th>
            <th className="border px-2 py-1">Service</th>
            <th className="border px-2 py-1">Level</th>
            <th className="border px-2 py-1">Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td className="border px-2 py-1">{log.timestamp}</td>
              <td className="border px-2 py-1">{log.service}</td>
              <td className="border px-2 py-1">{log.level}</td>
              <td className="border px-2 py-1">{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LogsTable;
