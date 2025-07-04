import { useEffect, useState } from "react";

function AnomaliesPanel() {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    fetch("/anomalies")
      .then((res) => res.json())
      .then((data) => setAnomalies(data.anomalies || []));
  }, []);

  return (
    <div className="p-4 mt-6 border border-red-500 rounded">
      <h2 className="text-xl font-bold text-red-700 mb-2">Anomalies</h2>
      {anomalies.length === 0 ? (
        <p className="text-gray-600">No anomalies detected.</p>
      ) : (
        <table className="table-auto w-full border border-red-500">
          <thead>
            <tr>
              <th className="border px-2 py-1 border-red-300">Timestamp</th>
              <th className="border px-2 py-1 border-red-300">Service</th>
              <th className="border px-2 py-1 border-red-300">Level</th>
              <th className="border px-2 py-1 border-red-300">Message</th>
            </tr>
          </thead>
          <tbody>
            {anomalies.map((log, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 border-red-300">
                  {log.timestamp}
                </td>
                <td className="border px-2 py-1 border-red-300">
                  {log.service}
                </td>
                <td className="border px-2 py-1 border-red-300">{log.level}</td>
                <td className="border px-2 py-1 font-semibold text-red-700 border-red-300">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AnomaliesPanel;
