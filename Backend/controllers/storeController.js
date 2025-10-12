import Store from "../models/store.js";

export async function createStore(req, res, next) {
    try {
        // owner เท่านั้น
        const ownerId = req.user?.userId;
        const store = await Store.create({ ...req.body, ownerId });
        res.status(201).json(store);
    } catch (e) { next(e); }
}

export async function getMyStores(req, res, next) {
    try {
        const stores = await Store.find({ ownerId: req.user.userId });
        res.json(stores);
    } catch (e) { next(e); }
}
