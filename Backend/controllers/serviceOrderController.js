import ServiceOrder from "../models/ServiceOrder.js";

export const getAllServiceOrders = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { status } = req.query;

    const filter = { storeId };
    if (status && status !== "all") filter.status = status;

    const orders = await ServiceOrder.find(filter).sort({ queueNumber: 1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Error fetching service orders:", err);
    res.status(500).json({ error: "Failed to fetch service orders" });
  }
};

export const createServiceOrder = async (req, res) => {
  try {
    const { storeId, services, staffId, staffName } = req.body;

    // หาคิวล่าสุดในร้านนั้น
    const lastOrder = await ServiceOrder.findOne({ storeId })
      .sort({ queueNumber: -1 })
      .limit(1);

    const nextQueue = lastOrder ? lastOrder.queueNumber + 1 : 1;

    const total = services.reduce((sum, s) => sum + s.price, 0);

    const order = await ServiceOrder.create({
      storeId,
      queueNumber: nextQueue,
      staffId: staffId || null,
      staffName: staffName || "",
      services,
      total,
      status: "waiting",
    });

    res.status(201).json({ message: "Service order created", order });
  } catch (err) {
    console.error("❌ Error creating service order:", err);
    res.status(500).json({ error: "Failed to create service order" });
  }
};

export const updateServiceOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["waiting", "inProgress", "done", "paid"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await ServiceOrder.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order status updated", order: updated });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const addServiceToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceId, name, price } = req.body;

    const order = await ServiceOrder.findById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "paid")
      return res.status(400).json({ error: "Cannot add service to a paid order" });

    order.services.push({ serviceId, name, price });
    order.total += price;
    order.updatedAt = Date.now();
    await order.save();

    res.json({ message: "Service added", order });
  } catch (err) {
    console.error("❌ Error adding service:", err);
    res.status(500).json({ error: "Failed to add service" });
  }
};
