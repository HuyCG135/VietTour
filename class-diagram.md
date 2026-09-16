# Biểu đồ Lớp - VietTour Database

---

## 1. User

**Thuộc tính:**
- id: int
- fullname: string
- phone: string
- email: string
- password: string
- address: string
- role: enum('customer','admin','tour-staff','booking-staff')
- status: int
- is_verified: int
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- register(fullname, phone, email, password): void
- login(username, password): {token, user}
- logout(): void
- getProfile(): User
- updateProfile(fullname, phone, address): User
- patchProfile(fields): User
- changePassword(currentPassword, newPassword): void
- forgotPassword(email): void
- resetPassword(token, newPassword): void
- verifyEmail(token): void
- resendVerification(email): void
- verifyTokenStatus(): boolean

---

## 2. Tour

**Thuộc tính:**
- id: int
- name: string
- slug: string
- description: text
- location: string
- region: string
- duration: string
- price_default: decimal
- price_child: decimal
- cover_image: string
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- getAllTours(filters, page, limit): {tours, total, page}
- getTourById(id): Tour
- getToursByRegion(region): Tour[]
- getTourFilters(): {regions, prices, durations, services}
- getCalendar(filters): Departure[]
- createTour(data): Tour
- updateTour(id, data): Tour
- deleteTour(id): void

---

## 3. TourImage

**Thuộc tính:**
- id: int
- tour_id: int
- image: string

**Phương thức:**
- getImagesByTour(tourId): TourImage[]
- addImage(tourId, image): TourImage
- removeImage(id): void
- removeImagesByTour(tourId): void

---

## 4. TourItinerary

**Thuộc tính:**
- id: int
- tour_id: int
- day_number: int
- description: text

**Phương thức:**
- getItinerariesByTour(tourId): TourItinerary[]
- addItinerary(tourId, dayNumber, description): TourItinerary
- updateItinerary(id, dayNumber, description): TourItinerary
- removeItinerary(id): void

---

## 5. TourDeparture

**Thuộc tính:**
- id: int
- tour_id: int
- departure_location: string
- departure_date: date
- price_moving: decimal
- price_moving_child: decimal
- seats_total: int
- seats_available: int
- status: enum('open','closed','full')
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- getDeparturesByTour(tourId): TourDeparture[]
- getDepartureById(id): TourDeparture
- addDeparture(data): TourDeparture
- updateDeparture(id, data): TourDeparture
- removeDeparture(id): void

---

## 6. Service

**Thuộc tính:**
- id: int
- name: string
- slug: string
- description: text
- icon: string
- status: int
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- getAllServices(): Service[]
- getServiceById(id): Service
- createService(data): Service
- updateService(id, data): Service
- deleteService(id): void

---

## 7. TourService

**Thuộc tính:**
- id: int
- tour_id: int
- service_id: int

**Phương thức:**
- getServicesByTour(tourId): Service[]
- addServiceToTour(tourId, serviceId): TourService
- removeServiceFromTour(tourId, serviceId): void

---

## 8. Booking

**Thuộc tính:**
- id: int
- user_id: int
- departure_id: int
- adults: int
- children: int
- total_price: decimal
- payment_status: enum('unpaid','paid','refunded')
- status: enum('pending','confirmed','cancelled')
- contact_name: string
- contact_phone: string
- contact_email: string
- note: text
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- createBooking(data): Booking
- getMyBookings(): Booking[]
- getBookingDetail(id): Booking
- getAllBookings(filters): {bookings, total}
- updateStatus(id, status): Booking
- cancelBooking(id): Booking
- deleteBooking(id): void
- createVNPayUrl(bookingId): string
- vnpayReturn(params): void

---

## 9. Review

**Thuộc tính:**
- id: int
- user_id: int
- tour_id: int
- rating: int
- comment: text
- created_at: datetime

**Phương thức:**
- getMyReviews(): Review[]
- getReviewsByTour(tourId): Review[]
- createReview(data): Review
- updateReview(id, data): Review
- deleteReview(id): void

---

## 10. Wishlist

**Thuộc tính:**
- id: int
- user_id: int
- tour_id: int
- created_at: datetime

**Phương thức:**
- getMyFavorites(): Tour[]
- getFavoriteIds(): int[]
- addFavorite(tourId): void
- removeFavorite(tourId): void

---

## 11. Passenger

**Thuộc tính:**
- id: int
- booking_id: int
- fullname: string
- gender: enum('Nam','Nữ','Khác')
- dob: date
- passenger_type: enum('adult','child')
- created_at: datetime
- updated_at: datetime

**Phương thức:**
- getPassengersByBooking(bookingId): Passenger[]
- addPassenger(bookingId, data): Passenger
- updatePassenger(id, data): Passenger
- removePassenger(id): void
- addPassengersBulk(bookingId, passengers[]): Passenger[]
