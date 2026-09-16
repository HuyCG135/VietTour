import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import bookingReducer, { BOOKING_ACTIONS, seedPassengers } from "./bookingReducer";
import { initialState, MAX_PASSENGERS } from "./bookingState";
import { validateBookingForm, getPassengerType } from "./bookingValidation";
import { getUnitPrices, getTotalPrice } from "./bookingPrices";

const DRAFT_PREFIX = "vt_booking_draft_";

const loadDraft = (tourId) => {
    try {
        const raw = localStorage.getItem(DRAFT_PREFIX + tourId);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const clearDraft = (tourId) => {
    try {
        localStorage.removeItem(DRAFT_PREFIX + tourId);
    } catch {
        // bỏ qua khi localStorage không khả dụng
    }
};

const buildInitialState = (prefill, tourId) => {
    const draft = loadDraft(tourId);
    if (draft) {
        return {
            ...initialState,
            contact: { ...initialState.contact, ...draft.contact },
            departureId: draft.departureId ?? initialState.departureId,
            adults: draft.adults ?? initialState.adults,
            children: draft.children ?? initialState.children,
            passengers: seedPassengers(draft.passengers, draft.adults + draft.children),
        };
    }
    return {
        ...initialState,
        contact: { ...initialState.contact, ...prefill },
    };
};

export default function useBookingForm(tour, departures, prefill = {}, onSubmit) {
    const [state, dispatch] = useReducer(bookingReducer, undefined, () =>
        buildInitialState(prefill, tour?.id ? String(tour.id) : ""),
    );
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const hasDraft = useMemo(
        () => Boolean(tour?.id && loadDraft(String(tour.id))),
        [tour],
    );

    const appliedPrefillRef = useRef({});

    useEffect(() => {
        if (hasDraft) return;
        const prev = appliedPrefillRef.current;
        for (const [field, value] of Object.entries(prefill)) {
            if (!value) continue;
            if (prev[field] !== value) {
                dispatch({ type: BOOKING_ACTIONS.SET_CONTACT, field, value });
            }
        }
        appliedPrefillRef.current = { ...prev, ...prefill };
    }, [prefill, hasDraft]);

    useEffect(() => {
        if (!tour?.id) return;
        const data = {
            contact: state.contact,
            departureId: state.departureId,
            adults: state.adults,
            children: state.children,
            passengers: state.passengers,
        };
        const timer = setTimeout(() => {
            try {
                localStorage.setItem(DRAFT_PREFIX + String(tour.id), JSON.stringify(data));
            } catch {
                // lưu nháp không bắt buộc
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [state, tour?.id]);

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
            passengers: Object.entries(state.passengers)
                .filter(([index]) => Number(index) < state.adults + state.children)
                .map(([index, pax]) => ({
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
            if (tour?.id) clearDraft(String(tour.id));
            onSubmit(payload);
            return true;
        },
        [validate, payload, onSubmit, tour],
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