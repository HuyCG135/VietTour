import { initialState, GENDER_OPTIONS } from "./bookingState";

export const BOOKING_ACTIONS = {
    SET_CONTACT: "SET_CONTACT",
    SET_DEPARTURE: "SET_DEPARTURE",
    SET_QTY: "SET_QTY",
    SET_PASSENGER: "SET_PASSENGER",
    RESET: "RESET",
};

const clampQty = (type, value) => {
    const num = Number(value);
    return type === "adults" ? Math.max(1, num) : Math.max(0, num);
};

const resizePassengers = (passengers, total) => {
    const next = {};
    for (const [index, pax] of Object.entries(passengers)) {
        if (Number(index) <= total) next[index] = pax;
    }
    return next;
};

export default function bookingReducer(state, action) {
    switch (action.type) {
        case BOOKING_ACTIONS.SET_CONTACT:
            return {
                ...state,
                contact: { ...state.contact, [action.field]: action.value },
            };
        case BOOKING_ACTIONS.SET_DEPARTURE:
            return { ...state, departureId: action.value };
        case BOOKING_ACTIONS.SET_QTY: {
            const adults = action.qtyType === "adults" ? clampQty("adults", action.value) : state.adults;
            const children = action.qtyType === "children" ? clampQty("children", action.value) : state.children;
            return {
                ...state,
                adults,
                children,
                passengers: resizePassengers(state.passengers, adults + children),
            };
        }
        case BOOKING_ACTIONS.SET_PASSENGER:
            return {
                ...state,
                passengers: {
                    ...state.passengers,
                    [action.index]: {
                        name: "",
                        gender: GENDER_OPTIONS[0],
                        dob: "",
                        ...(state.passengers[action.index] || {}),
                        [action.field]: action.value,
                    },
                },
            };
        case BOOKING_ACTIONS.RESET:
            return initialState;
        default:
            return state;
    }
}