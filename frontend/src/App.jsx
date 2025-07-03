import LogsTable from "./components/LogsTable";

function App() {
  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Incident Response Dashboard</h1>
      <LogsTable />
    </div>
  );
}

export default App;
