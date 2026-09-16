const TourGallery = ({ images = [], name = "Tour" }) => {
    const hasImages = images.length > 0;

    return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl lg:rounded-3xl overflow-hidden lg:grid-cols-4 lg:grid-rows-2 lg:h-[420px]">
            {hasImages ? (
                <>
                    <div className="relative col-span-2 row-span-2 h-56 sm:h-72 lg:h-auto group">
                        <img
                            src={images[0]}
                            alt={name}
                            loading="eager"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {images.slice(1, 5).map((src, i) => (
                        <div key={`${src}-${i}`} className="relative h-32 sm:h-44 lg:h-auto group overflow-hidden">
                            <img
                                src={src}
                                alt={`${name} ảnh ${i + 2}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ))}
                </>
            ) : (
                <div className="col-span-2 row-span-2 h-56 sm:h-72 lg:col-span-4 lg:row-span-2 bg-slate-100 flex items-center justify-center text-sm text-muted">
                    Chưa có hình ảnh
                </div>
            )}
        </div>
    );
};

export default TourGallery;