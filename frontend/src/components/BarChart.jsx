import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No chart data yet</p>;

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="service"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={["#ff6b6b", "#6bc1ff", "#6bff95"]}
        axisBottom={{ tickRotation: -45 }}
        animate={true}
        enableLabel={true} // shows values on bars
        labelTextColor="#ffffff" // sets bar label text color
        theme={{
          axis: {
            ticks: {
              text: {
                fill: "#ffffff", // axis tick text
              },
            },
            legend: {
              text: {
                fill: "#cccccc", // axis legend text (if used)
              },
            },
          },
          labels: {
            text: {
              fill: "#ffffff", // text on bars
            },
          },
        }}
        tooltip={({ id, value }) => (
          <strong style={{ color: "white" }}>
            {id}: {value}
          </strong>
        )}
      />
    </div>
  );
};

export default BarChart;
