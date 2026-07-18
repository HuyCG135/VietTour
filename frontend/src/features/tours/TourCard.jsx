import { Link } from "react-router-dom";
import defaultTourImage from "../../assets/images/image.png";

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
}

export default function TourCard({ tour }) {
    return (
        <div className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-0.75rem)]">
            <Link to={`/tours/${tour.id}`} className="no-underline text-inherit">
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 relative">
                    <img src={tour.image || tour.cover_image || defaultTourImage} className="h-48 w-full object-cover" alt={tour.name} />

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-sky-500 text-white">{tour.location || tour.region}</span>
                        <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-blue-600 text-white">{tour.duration}</span>
                    </div>

                    <div className="p-4">
                        <h5 className="text-lg font-semibold mb-2.5 text-gray-800 line-clamp-2">{tour.name}</h5>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2.5">{tour.description}</p>

                        <div className="text-sm text-gray-600">
                            <b>Giá:</b>
                            <span className="text-red-600 text-lg font-bold ml-1">{formatPrice(tour.price || tour.price_default)}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
