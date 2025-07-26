export const formatDateTime = (dateString: any) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} at ${hours}h:${minutes}`;
};


export const formatDateToCustomString = (dateInput: any) => {
    const date = new Date(dateInput);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    const getDaySuffix = (day: any) => {
        if (day > 3 && day < 21) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    return `${getDaySuffix(day)} ${month} ${year} at ${formattedHour}:${formattedMinute} ${period}`;
}

export const getGreeting = (name:any) => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
        return `Good morning, ${name}!`;
    } else if (currentHour < 18) {
        return `Good afternoon, ${name}!`;
    } else {
        return `Good evening, ${name}!`;
    }
};