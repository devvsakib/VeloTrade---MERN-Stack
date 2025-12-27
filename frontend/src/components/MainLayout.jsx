import { useTheme } from '../context/ThemeContext';

const MainLayout = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen ${theme === 'dark'
            ? 'bg-black text-white'
            : 'bg-linear-to-br from-gray-50 via-blue-50 to-gray-50 text-gray-900'
            }`}>
            {children}
        </div>
    );
};

export default MainLayout;
