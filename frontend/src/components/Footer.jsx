export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap gap-8">
                    <div className="w-full md:w-5/12 lg:w-1/3">
                        <h5 className="font-bold text-lg mb-3">VietTour</h5>
                        <p className="text-gray-400 text-sm leading-relaxed">Khám phá Việt Nam cùng VietTour — đồng hành cùng bạn trên mọi hành trình.</p>
                    </div>

                    <div className="w-full md:w-5/12 lg:w-1/6">
                        <h6 className="font-bold mb-3">Hỗ trợ</h6>
                        <ul className="list-none p-0 m-0 text-sm text-gray-400 space-y-1">
                            <li className="hover:text-white transition-colors cursor-pointer">Trung tâm trợ giúp</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Chính sách bảo mật</li>
                            <li className="hover:text-white transition-colors cursor-pointer">Điều khoản sử dụng</li>
                        </ul>
                    </div>

                    <div className="w-full md:w-5/12 lg:w-1/4">
                        <h6 className="font-bold mb-3">Liên hệ</h6>
                        <ul className="list-none p-0 m-0 text-sm text-gray-400 space-y-1">
                            <li>
                                <i className="fa-solid fa-envelope mr-2" />
                                info@viettour.vn
                            </li>
                            <li>
                                <i className="fa-solid fa-phone mr-2" />
                                1900 xxxx
                            </li>
                            <li>
                                <i className="fa-solid fa-location-dot mr-2" />
                                Hà Nội, Việt Nam
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-5/12 lg:w-1/4">
                        <h6 className="font-bold mb-3">Theo dõi</h6>
                        <div className="flex gap-4 text-xl">
                            <i className="fa-brands fa-facebook hover:text-blue-400 transition-colors cursor-pointer" />
                            <i className="fa-brands fa-instagram hover:text-pink-400 transition-colors cursor-pointer" />
                            <i className="fa-brands fa-youtube hover:text-red-400 transition-colors cursor-pointer" />
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-gray-700" />
                <p className="text-center text-gray-500 text-sm mb-0">&copy; {new Date().getFullYear()} VietTour. All rights reserved.</p>
            </div>
        </footer>
    );
}
