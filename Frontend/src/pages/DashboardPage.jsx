import Dashboard from "../components/Dashboard";
import { useParams } from "react-router-dom";


export default function DashboardPage() {
    const { storeId } = useParams();
    return (
        <div>
            <Dashboard storeId={storeId} />
        </div>
    );
}