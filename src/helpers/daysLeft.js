export default function daysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);

    // Difference in milliseconds
    const diffMs = end - now;

    // Convert milliseconds to days
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
}