// Fetch and display events
function displayEvents() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    const events = JSON.parse(localStorage.getItem('events')) || [];

    if (events.length === 0) {
        eventList.innerHTML = '<li>No events available.</li>';
        return;
    }

    events.forEach((event) => {

        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });

        const eventItem = document.createElement('li');
        eventItem.className = 'event-item';

        eventItem.innerHTML = `
        <div class="event-con">
            <div class="event-list-title">
                <div class="event-icon"></div>
                <div class="event-date-time">${formattedDate} - ${event.time}</div>
            </div>
            <div class="event-list-container">
                <img class="event-arrow" src="image/arrow.png" alt="Arrow">
                <div class="event-title">${event.title}</div>
            </div>
        </div>
        `;

        eventList.appendChild(eventItem);
    });
}
