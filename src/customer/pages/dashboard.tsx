import Sidebar from "../components/Sidebar";

const Dashboard = () => {

    return (
        <div>
            <Sidebar />

            <div style={{ marginLeft: "60px" }}>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard!</p>
            </div>
        </div>
    );
};
export default Dashboard;