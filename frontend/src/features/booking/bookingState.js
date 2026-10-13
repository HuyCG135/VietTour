export const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];

export const MAX_PASSENGERS = 50;

export const initialState = {
    contact: {
        name: "",
        phone: "",
        dob: "",
        gender: GENDER_OPTIONS[0],
        email: "",
        note: "",
    },
    departureId: "",
    adults: 1,
    children: 0,
    passengers: {},
};