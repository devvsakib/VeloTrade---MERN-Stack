import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/Spinner';
import {
    Users as UsersIcon,
    Search,
    Shield,
    ShieldCheck,
    ShieldAlert,
    ToggleLeft,
    ToggleRight,
    Trash2,
    Mail,
    UserCheck,
    UserX,
    Briefcase,
    Store
} from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const Users = () => {
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users'],
        queryFn: () => adminAPI.getUsers()
    });

    const toggleActiveMutation = useMutation({
        mutationFn: (id) => adminAPI.toggleUserActive(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User status updated');
        }
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }) => adminAPI.updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User role updated');
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id) => adminAPI.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User deleted');
        }
    });

    const filteredUsers = users?.data?.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <Spinner size="xl" className="py-20" />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-5xl font-black gradient-text">User Management</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary-500 w-full md:w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence mode='popLayout'>
                    {filteredUsers?.map((user) => (
                        <motion.div
                            key={user._id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card glass className="p-6 transition-all hover:bg-white/8 group">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500' :
                                            user.role === 'VENDOR' ? 'bg-primary-500/10 text-primary-500' :
                                                'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {user.role === 'ADMIN' ? <Shield size={24} /> :
                                                user.role === 'VENDOR' ? <Store size={24} /> :
                                                    <UsersIcon size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold group-hover:text-primary-400 transition-colors">{user.name}</h3>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                <Mail size={14} /> {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Role Selector */}
                                        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                                            {['CUSTOMER', 'VENDOR', 'ADMIN'].map((role) => (
                                                <button
                                                    key={role}
                                                    onClick={() => updateRoleMutation.mutate({ id: user._id, role })}
                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${user.role === role
                                                        ? 'bg-primary-500 text-white shadow-lg'
                                                        : 'text-gray-500 hover:text-gray-300'
                                                        }`}
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Status Toggle */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleActiveMutation.mutate(user._id)}
                                            className={`gap-2 border-white/10 ${user.isActive ? 'hover:border-green-500/50' : 'hover:border-red-500/50'}`}
                                        >
                                            {user.isActive ? (
                                                <><UserCheck className="text-green-500" size={16} /> Active</>
                                            ) : (
                                                <><UserX className="text-red-500" size={16} /> Inactive</>
                                            )}
                                        </Button>

                                        {/* Delete Action */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this user?')) {
                                                    deleteUserMutation.mutate(user._id);
                                                }
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Users;
