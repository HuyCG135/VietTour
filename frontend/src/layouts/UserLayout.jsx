import Header from "../components/Header";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout({ children }) {
    return (
        <>
            <Header />
            <div className="max-w-full mx-auto px-4 lg:px-8 pt-4 lg:pt-8 pb-4 lg:pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-6 items-start">
                    <div id="user-sidebar-col">
                        <UserSidebar />
                    </div>

                    <div id="user-main-col" className="min-w-0">
                        <div className="bg-white rounded-2xl shadow-[0_8px_28px_rgba(30,41,59,0.08)] min-h-[420px]">
                            <div className="p-6">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
