import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).populate("parent");
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getCategoryTree = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });

        const buildHierarchy = (items, parentId = null) => {
            return items
                .filter(item => {
                    const itemParentId = item.parent ? item.parent.toString() : null;
                    const targetParentId = parentId ? parentId.toString() : null;
                    return itemParentId === targetParentId;
                })
                .map(item => ({
                    ...item._doc,
                    children: buildHierarchy(items, item._id)
                }));
        };

        const hierarchy = buildHierarchy(categories);
        res.json(hierarchy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, parent, image } = req.body;
        const slug = name.toLowerCase().replace(/ /g, "-") + "-" + Date.now();
        const category = await Category.create({ name, slug, parent, image });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
