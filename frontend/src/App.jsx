import GrowthChart from "./components/charts/GrowthChart";
import Layout from "./components/Layout";
import SalesChart from "./components/charts/SalesChart";
import NewCustomerChart from "./components/charts/NewCustomers";
import RepeatCustomerChart from "./components/charts/RepeatCustomers";
import GeoChart from "./components/charts/GeoChart";

function App() {
  return (
    <Layout>
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:p-4 gap-x-4 gap-y-16">
        <SalesChart />
        <GrowthChart />
        <NewCustomerChart />
        <RepeatCustomerChart />
        <GeoChart />
      </div>
    </Layout>
  );
}

export default App;
