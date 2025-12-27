import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    FolderTree,
    Plus,
    Trash2,
    ChevronRight,
    ChevronDown,
    LayoutGrid,
    Edit3,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

const CategoryNode = ({ category, level = 0, onAddSub, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="space-y-2">
            <div
                className={`flex items-center group bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-all`}
                style={{ marginLeft: `${level * 24}px` }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-1 hover:bg-white/10 rounded transition-opacity ${!hasChildren ? 'opacity-0 cursor-default' : ''}`}
                >
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>

                <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center text-primary-400 border border-white/10">
                        {category.image ? <img src={category.image} className="w-full h-full object-cover rounded" alt="" /> : <LayoutGrid size={16} />}
                    </div>
                    <span className="font-bold text-white">{category.name}</span>
                    <span className="text-xs text-gray-500 font-mono">/{category.slug}</span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-400" onClick={() => onAddSub(category._id)}>
                        <Plus size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400" onClick={() => toast.info('Edit coming soon!')}>
                        <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(category._id)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {category.children.map(child => (
                            <CategoryNode
                                key={child._id}
                                category={child}
                                level={level + 1}
                                onAddSub={onAddSub}
                                onDelete={onDelete}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Categories = () => {
    const queryClient = useQueryClient();
    const { data: categoryTreeResponse, isLoading } = useQuery({
        queryKey: ['category-tree'],
        queryFn: () => categoriesAPI.getTree()
    });

    const categoryTree = categoryTreeResponse?.data || [];

    const createMutation = useMutation({
        mutationFn: (data) => categoriesAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['category-tree']);
            toast.success('Category created');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => categoriesAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['category-tree']);
            toast.success('Category deleted');
        }
    });

    const handleAddRoot = () => {
        const name = prompt('Enter Category Name:');
        if (name) createMutation.mutate({ name });
    };

    const handleAddSub = (parentId) => {
        const name = prompt('Enter Sub-Category Name:');
        if (name) createMutation.mutate({ name, parent: parentId });
    };

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-5xl font-black gradient-text">Categories</h1>
                    <p className="text-gray-400 mt-2">Manage your hierarchical product structure</p>
                </div>
                <Button onClick={handleAddRoot} className="gradient-primary gap-2 shadow-xl shadow-primary-500/20">
                    <Plus size={20} /> Add Root Category
                </Button>
            </div>

            <Card glass className="p-8 border-white/5">
                <div className="space-y-4">
                    {categoryTree?.length > 0 ? (
                        categoryTree.map(cat => (
                            <CategoryNode
                                key={cat._id}
                                category={cat}
                                onAddSub={handleAddSub}
                                onDelete={(id) => {
                                    if (confirm('Delete this category and all its children?')) {
                                        deleteMutation.mutate(id);
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-500 space-y-4">
                            <FolderTree size={60} className="mx-auto opacity-20" />
                            <p>No categories found. Start by adding a root category.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Categories;
