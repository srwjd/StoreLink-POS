import { useStore } from "../context/StoreContext";
import MainMenuGeneral from "../components/mainmenu/MainMenuGeneral";
import MainMenuRestaurant from "../components/mainmenu/MainMenuRestaurant";
import MainMenuService from "../components/mainmenu/MainMenuService";

export default function MainMenuTemplate() {
    const { store } = useStore();
    const type = store?.storeType || "general";


    if (type === "restaurant") return <MainMenuRestaurant />;
    if (type === "service") return <MainMenuService />;
    return <MainMenuGeneral />;
}
