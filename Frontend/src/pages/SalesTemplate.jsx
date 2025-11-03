import { useStore } from "../context/StoreContext";


import SalesGeneral from "./salesGeneral";
import SalesRestaurant from "./SalesRestaurant";

export default function SalesTemplate() {
    const { store } = useStore();
    const type = store?.storeType || "general";

    if (type === "restaurant") return <SalesRestaurant />;
    return <SalesGeneral />;
}