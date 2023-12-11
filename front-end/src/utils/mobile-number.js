export function formatMobileNumber(mobile_number) {
    return mobile_number.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};