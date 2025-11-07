/* eslint-disable react/prop-types */
import ProductTable from "../../../components/products/ProductTable";

export default function ProductService({ storeId }) {
    return (
        <div>
            <h1 className="text-2xl font-semibold text-[#3674B5] mb-6">
                💇 จัดการบริการ
            </h1>
            <ProductTable storeId={storeId} type="service" />
        </div>
    );
}
