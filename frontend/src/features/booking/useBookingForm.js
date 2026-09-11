import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import bookingReducer, { BOOKING_ACTIONS } from "./bookingReducer";
import { initialState, MAX_PASSENGERS } from "./bookingState";
import { validateBookingForm, getPassengerType } from "./bookingValidation";
import { getUnitPrices, getTotalPrice } from "./bookingPrices";

const buildInitialState = (prefill) => ({
    ...initialState,
    contact: { ...initialState.contact, ...prefill },
});

export default function useBookingForm(tour, departures, prefill = {}, onSubmit) {
    const [state, dispatch] = useReducer(bookingReducer, undefined, () => buildInitialState(prefill));
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        for (const [field, value] of Object.entries(prefill)) {
            if (!value) continue;
            dispatch({ type: BOOKING_ACTIONS.SET_CONTACT, field, value });
        }
    }, [prefill]);

    const departure = useMemo(
        () => departures.find((d) => d.id == state.departureId) || null,
        [departures, state.departureId],
    );

    const unitPrices = useMemo(() => getUnitPrices(tour, departure), [tour, departure]);

    const total = useMemo(
        () => getTotalPrice(tour, departure, state.adults, state.children),
        [tour, departure, state.adults, state.children],
    );

    const paxCount = state.adults + state.children;
    const maxAdults = departure
        ? Math.min(departure.seats_available - state.children, MAX_PASSENGERS)
        : MAX_PASSENGERS;
    const maxChildren = departure
        ? Math.min(departure.seats_available - state.adults, MAX_PASSENGERS)
        : MAX_PASSENGERS;

    const payload = useMemo(
        () => ({
            departure_id: state.departureId ? Number(state.departureId) : null,
            adults: state.adults,
            children: state.children,
            contact_name: state.contact.name,
            contact_phone: state.contact.phone,
            contact_dob: state.contact.dob,
            contact_gender: state.contact.gender,
            contact_email: state.contact.email,
            note: state.contact.note,
            passengers: Object.entries(state.passengers).map(([index, pax]) => ({
                name: pax.name,
                gender: pax.gender,
                dob: pax.dob,
                type: getPassengerType(Number(index), state.adults),
            })),
        }),
        [state],
    );

    const setContact = useCallback((field, value) => {
        dispatch({ type: BOOKING_ACTIONS.SET_CONTACT, field, value });
        setErrors((prev) => ({ ...prev, [`contact_${field}`]: undefined }));
    }, []);

    const setDeparture = useCallback((value) => {
        dispatch({ type: BOOKING_ACTIONS.SET_DEPARTURE, value: String(value) });
        setErrors((prev) => ({ ...prev, departure_id: undefined, pax: undefined }));
    }, []);

    const setQty = useCallback(
        (qtyType, value) => {
            const max = qtyType === "adults" ? maxAdults : maxChildren;
            const next = Math.min(Number(value), Math.max(0, max));
            dispatch({ type: BOOKING_ACTIONS.SET_QTY, qtyType, value: next });
            setErrors((prev) => ({ ...prev, pax: undefined }));
        },
        [maxAdults, maxChildren],
    );

    const setAdults = useCallback((value) => setQty("adults", value), [setQty]);
    const setChildren = useCallback((value) => setQty("children", value), [setQty]);

    const setPassenger = useCallback((index, field, value) => {
        dispatch({ type: BOOKING_ACTIONS.SET_PASSENGER, index: String(index), field, value });
        setErrors((prev) => ({ ...prev, [`ps_${field}_${index}`]: undefined, pax: undefined }));
    }, []);

    const markTouched = useCallback(
        (key) => {
            setTouched((prev) => ({ ...prev, [key]: true }));
            const nextErrors = validateBookingForm(state, tour, departure);
            setErrors((prev) => ({ ...prev, [key]: nextErrors[key] }));
        },
        [state, tour, departure],
    );

    const validate = useCallback(() => validateBookingForm(state, tour, departure), [state, tour, departure]);

    const handleSubmit = useCallback(
        (event) => {
            if (event?.preventDefault) event.preventDefault();
            const nextErrors = validate();
            setErrors(nextErrors);
            setSubmitted(true);
            if (Object.keys(nextErrors).length > 0) return false;
            onSubmit(payload);
            return true;
        },
        [validate, payload, onSubmit],
    );

    const reset = useCallback(() => {
        dispatch({ type: BOOKING_ACTIONS.RESET });
        setErrors({});
        setTouched({});
        setSubmitted(false);
    }, []);

    const fieldError = useCallback(
        (key) => ((submitted || touched[key]) && errors[key]) || undefined,
        [errors, submitted, touched],
    );

    return {
        state,
        errors,
        submitted,
        departure,
        unitPrices,
        total,
        paxCount,
        maxAdults,
        maxChildren,
        payload,
        setContact,
        setDeparture,
        setQty,
        setAdults,
        setChildren,
        setPassenger,
        markTouched,
        validate,
        handleSubmit,
        fieldError,
        reset,
    };
}