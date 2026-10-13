export const formatVnd = (value) => `${Number(value || 0).toLocaleString("vi-VN")} ₫`;

export const getUnitPrices = (tour, departure) => ({
    adult: Number(tour.price_default) + Number(departure?.price_moving || 0),
    child: Number(tour.price_child) + Number(departure?.price_moving_child || 0),
});

export const getTotalPrice = (tour, departure, adults, children) => {
    const { adult, child } = getUnitPrices(tour, departure);
    return adults * adult + children * child;
};