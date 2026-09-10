const DEFAULT_BACKGROUND =
    "https://img.fitreisen.group/eyJidWNrZXQiOiJmaXRyZWlzZW4tY2RuLWltYWdlcyIsImtleSI6ImxvdHVzLXRyYXZlbC1jb20vcmVzb3VyY2VzcGFjZS82MDQwMyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTYwMCwiaGVpZ2h0Ijo1MDAsImZpdCI6ImNvdmVyIiwicG9zaXRpb24iOiJjZW50ZXIifX19?signature=7be11c7d9fcf9fee3b80d7e93ff4735a0b8b05034f2eaf85ad0e594608fe06f8";

const HomeHero = ({ backgroundImage = DEFAULT_BACKGROUND }) => {
    return (
        <section className="relative w-full pb-24">
            <div
                className="h-[420px] w-full bg-cover bg-center bg-sky-100"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            <div className="absolute bottom-0 left-1/2 w-[92%] max-w-[700px] -translate-x-1/2 rounded-[20px] bg-white px-9 pb-6 pt-8 shadow-[0_20px_45px_rgba(15,40,60,0.15)]">
                <h1 className="mb-1.5 text-[28px] font-bold text-primary">
                    VietTour welcome!
                </h1>
                <p className="mb-6 text-[15px] text-slate-600">
                    Khám phá những miền đẹp nhất Việt Nam cùng chúng tôi
                </p>

                <div className="flex flex-wrap items-center gap-3 rounded-full border border-slate-200 py-2 pl-5 pr-2 sm:flex-nowrap">
                    <div className="flex w-[45%] min-w-0 flex-1 items-center gap-2.5 sm:w-auto">
                        <i className="fa-solid fa-location-dot shrink-0 text-lg text-slate-400" />
                        <div className="min-w-0">
                            <span className="block text-[13px] font-semibold text-slate-800">
                                Location
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                                Add destination
                            </span>
                        </div>
                    </div>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <div className="flex w-[45%] min-w-0 flex-1 items-center gap-2.5 sm:w-auto">
                        <i className="fa-regular fa-calendar shrink-0 text-lg text-slate-400" />
                        <div className="min-w-0">
                            <span className="block text-[13px] font-semibold text-slate-800">
                                Check in
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                                Add dates
                            </span>
                        </div>
                    </div>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <div className="flex w-[45%] min-w-0 flex-1 items-center gap-2.5 sm:w-auto">
                        <i className="fa-regular fa-calendar shrink-0 text-lg text-slate-400" />
                        <div className="min-w-0">
                            <span className="block text-[13px] font-semibold text-slate-800">
                                Check out
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                                Add dates
                            </span>
                        </div>
                    </div>

                    <div className="hidden h-8 w-px shrink-0 bg-slate-200 sm:block" />

                    <div className="flex w-[45%] min-w-0 flex-1 items-center gap-2.5 sm:w-auto">
                        <i className="fa-solid fa-user-group shrink-0 text-lg text-slate-400" />
                        <div className="min-w-0">
                            <span className="block text-[13px] font-semibold text-slate-800">
                                Guests
                            </span>
                            <span className="block truncate text-xs text-slate-400">
                                Add guests
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Search"
                        className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
                    >
                        <i className="fa-solid fa-magnifying-glass text-lg" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;