import { useEffect, useState } from "react";

function AnomaliesPanel() {
  const [anomalies, setAnomalies] = useState([]);

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
              {anomalies.map((log, index) => (
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
          <div className="page-section">
            <div className="page-arrow">&lt;</div>
            <div className="page-number">250</div>
            <div className="page-arrow">&gt;</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnomaliesPanel;
