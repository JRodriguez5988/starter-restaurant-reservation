export function formatMobileNumber(mobile_number) {
    return mobile_number.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

function formatNumber(reservation) {
    reservation.mobile_number = reservation.mobile_number.replace(/\D+/g, '');
    return reservation;
};

export function formatMobileNumberForForm(reservations) {
    return Array.isArray(reservations)
        ? reservations.map(formatNumber)
        : formatNumber(reservations);
};