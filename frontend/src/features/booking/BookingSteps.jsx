import React from "react";
import { Link } from "react-router-dom";

export default function BookingSteps({ tourCoverImage, tourName }) {
    return (
        <header className="relative overflow-hidden bg-foreground text-white">
            {tourCoverImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl scale-110 brightness-50"
                    aria-hidden="true"
                    style={{ backgroundImage: `url(${tourCoverImage})` }}
                />
            )}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-foreground/30" aria-hidden="true" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-14 sm:pb-16 lg:mt-10">
                <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-white/60 mb-6">
                    <Link to="/" className="hover:text-white transition-colors no-underline">VietTour</Link>
                    <i className="fa-solid fa-angle-right text-[10px] text-white/30" aria-hidden="true" />
                    {tourName && (
                        <>
                            <Link to="/tours" className="hover:text-white transition-colors no-underline">Tour du lịch</Link>
                            <i className="fa-solid fa-angle-right text-[10px] text-white/30" aria-hidden="true" />
                            <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[340px]">{tourName}</span>
                            <i className="fa-solid fa-angle-right text-[10px] text-white/30" aria-hidden="true" />
                        </>
                    )}
                    <span className="font-bold text-white" aria-current="page">Đặt tour</span>
                </nav>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug mb-8">
                    Hoàn tất đặt tour
                </h1>

                <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-primary font-extrabold">
                            01
                        </span>
                        <span className="font-bold text-white">Thông tin &amp; Đặt chỗ</span>
                    </div>
                    <span className="text-white/20">••••</span>
                    <div className="flex items-center gap-2.5 opacity-40">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 font-extrabold text-white">
                            02
                        </span>
                        <span className="font-bold">Thanh toán</span>
                    </div>
                </div>
            </div>
        </header>
    );
}