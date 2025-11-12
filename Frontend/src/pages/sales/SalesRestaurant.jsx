import { useState } from "react";
import Header from "../../components/shared/Header";
import RestaurantOrderPanel from "../../components/restaurant/RestaurantOrderPanel";

export default function SalesRestaurant() {
    const [mode, setMode] = useState(null); // dine-in | takeaway
    const [selectedTable, setSelectedTable] = useState(null);


    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#EAF2FF] to-[#C6D8FF]">
            <Header />

            <main className="flex-1 p-5">
                    <RestaurantOrderPanel
                        mode={mode}
                        tableId={selectedTable}
                        onBack={() => {
                            setSelectedTable(null);
                            setMode(null);
                        }}
                    />
            </main>
        </div>
    );
}
