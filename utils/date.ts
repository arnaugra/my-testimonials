type inputDate = {days?: number, months?: number, years?: number}
export function futureDate(props: inputDate = {}) {
    const { days, months, years } = props
    const now = new Date();

    days && now.setDate(now.getDate() + days);
    months && now.setMonth(now.getMonth() + months);
    years && now.setFullYear(now.getFullYear() + years)

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    const h = "23:59";

    return `${yyyy}-${mm}-${dd}T${h}`;
}
