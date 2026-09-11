const PHONE_REGEX = /^(0\d{9,10}|\+84\d{9,10})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
};

export const getAge = (dob) => {
    const birth = parseDate(dob);
    if (!birth) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age -= 1;
    return age;
};

export const getPassengerType = (index, adults) => (index <= adults ? "adult" : "child");

export const validateBookingForm = (state, tour, departure) => {
    const { contact, departureId, adults, children, passengers } = state;
    const errors = {};

    if (!contact.name.trim()) {
        errors.contact_name = "Vui lòng nhập tên người liên hệ";
    }

    if (!contact.phone.trim()) {
        errors.contact_phone = "Vui lòng nhập số điện thoại";
    } else if (!PHONE_REGEX.test(contact.phone.trim())) {
        errors.contact_phone = "Số điện thoại không hợp lệ";
    }

    if (!contact.dob) {
        errors.contact_dob = "Vui lòng chọn ngày sinh";
    } else if (getAge(contact.dob) < 18) {
        errors.contact_dob = "Người đặt tour phải đủ 18 tuổi trở lên";
    }

    if (!contact.email.trim()) {
        errors.contact_email = "Vui lòng nhập email";
    } else if (!EMAIL_REGEX.test(contact.email.trim())) {
        errors.contact_email = "Email không hợp lệ";
    }

    if (!departureId) {
        errors.departure_id = "Vui lòng chọn ngày khởi hành";
    } else if (departure && adults + children > departure.seats_available) {
        errors.pax = `Lịch khởi hành này chỉ còn ${departure.seats_available} chỗ`;
    }

    for (const [index, pax] of Object.entries(passengers)) {
        const isAdult = getPassengerType(Number(index), adults) === "adult";
        if (!pax.name.trim()) {
            errors[`ps_name_${index}`] = "Vui lòng nhập họ tên";
        }
        if (!pax.dob) {
            errors[`ps_dob_${index}`] = "Vui lòng chọn ngày sinh";
        } else {
            const age = getAge(pax.dob);
            if (isAdult && age < 6) {
                errors[`ps_dob_${index}`] = "Người lớn phải từ 6 tuổi trở lên";
            } else if (!isAdult && age >= 6) {
                errors[`ps_dob_${index}`] = "Trẻ em phải dưới 6 tuổi";
            }
        }
    }

    return errors;
};