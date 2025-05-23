import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 bg-gray-50">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout;