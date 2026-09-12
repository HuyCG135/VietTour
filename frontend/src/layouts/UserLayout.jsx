import Header from "../components/Header";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout({ children }) {
    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* items-stretch đảm bảo cả 2 cột luôn kéo dài bằng chằn chặn nhau, mép dưới phẳng tuyệt đối */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-stretch">
                    <aside id="user-sidebar-col" className="flex flex-col h-full">
                        <UserSidebar />
                    </aside>

                    <main id="user-main-col" className="min-w-0 flex flex-col h-full">
                        <div className="bg-surface rounded-2xl border border-border shadow-[0_8px_28px_rgba(30,41,59,0.08)] h-full flex flex-col">
                            <div className="p-6 lg:p-8 flex-1 flex flex-col">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
