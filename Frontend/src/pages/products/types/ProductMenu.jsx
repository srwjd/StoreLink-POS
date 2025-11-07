/* eslint-disable react/prop-types */

import ProductTable from "../../../components/products/ProductTable";


export default function ProductMenu({ storeId }) {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#3674B5] mb-6">
                🍽️ จัดการเมนูอาหาร
            </h1>
            <ProductTable storeId={storeId} type="menu" />
        </div>
    );
}
