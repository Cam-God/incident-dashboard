import LogsTable from "./components/LogsTable";
import AnomaliesPanel from "./components/AnomaliesPanel";

function App() {
  return (
    <div className="p-6 font-sans content">
      <h1 className="text-2xl font-bold mb-4">Incident Response Dashboard</h1>
      <LogsTable />
      <AnomaliesPanel />
    </div>
  );
}

export default App;
