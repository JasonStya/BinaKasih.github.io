      // Define the admin password (for demo purposes)
      
      const adminPassword = "binakasih"; // Change this to your desired password


      const currentDate = new Date();
      let selectedDate;
      
      // Show the password modal
      function showPasswordModal(callback) {
        const modal = document.getElementById('passwordModal');
        const submitButton = document.getElementById('submitPasswordBtn');
        const cancelButton = document.getElementById('cancelPasswordBtn');
        const passwordInput = document.getElementById('adminPasswordInput');
      
        modal.style.display = 'block';
      
        // Handle submit
        submitButton.onclick = function () {
          const inputPassword = passwordInput.value;
          if (inputPassword === adminPassword) {
            callback(true); // Correct password
          } else {
            alert('Incorrect password!');
            callback(false); // Incorrect password
          }
          modal.style.display = 'none'; // Hide modal
          passwordInput.value = ''; // Clear input
        };
      
        // Handle cancel
        cancelButton.onclick = function () {
          modal.style.display = 'none';
          callback(false); // Cancelled
        };
      
        // Hide modal on outside click
        window.onclick = function (event) {
          if (event.target === modal) {
            modal.style.display = 'none';
            callback(false);
          }
        };
      }
      
      // Generate Calendar
      function generateCalendar(month, year) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const calendarDates = document.getElementById('calendarDates');
        calendarDates.innerHTML = '';
        document.getElementById('monthYear').innerText = `${currentDate.toLocaleString('default', {
          month: 'long',
        })} ${year}`;
      
        const events = JSON.parse(localStorage.getItem('events')) || [];
      
        for (let i = 0; i < firstDay; i++) {
          const emptyDiv = document.createElement('div');
          calendarDates.appendChild(emptyDiv);
        }
      
        for (let day = 1; day <= daysInMonth; day++) {
          const dateDiv = document.createElement('div');
          dateDiv.innerHTML = `<span>${day}</span>`;
      
          const eventDate = new Date(year, month, day).toLocaleDateString();
          const dailyEvents = events.filter((event) => event.date === eventDate);
          const eventCount = dailyEvents.length;
      
          if (eventCount > 0) {
            const indicator = document.createElement('span');
            indicator.style.display = 'block';
            indicator.style.width = '10px';
            indicator.style.height = '10px';
            indicator.style.borderRadius = '50%';
            indicator.style.backgroundColor = 'blue';
            indicator.style.marginTop = '-9px';
      
            const countText = document.createElement('span');
            countText.innerText = eventCount;
            countText.style.fontSize = '12px';
            countText.style.color = 'black';
            countText.style.marginLeft = '5px';
            dateDiv.appendChild(indicator);
            dateDiv.appendChild(countText);
          }
      
          dateDiv.addEventListener('click', () => openModal(day, month, year));
          calendarDates.appendChild(dateDiv);
        }
      }
      
      function openModal(day, month, year) {
        const modal = document.getElementById('eventModal');
        const closeBtn = document.querySelector('.close-btn');
        modal.style.display = 'block';
        selectedDate = new Date(year, month, day).toLocaleDateString();
      
        closeBtn.onclick = function () {
          modal.style.display = 'none';
        };
      
        window.onclick = function (event) {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        };
      }
      
      function cleanupPastEvents() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const currentDateObjCal = new Date();
        currentDateObjCal.setHours(0, 0, 0, 0); // Normalize to midnight
    
        // Filter out past events
        const filteredEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0); // Normalize event date
            return eventDate >= currentDateObjCal;
        });
    
        console.log('Filtered Events:', filteredEvents); // Debugging
        localStorage.setItem('events', JSON.stringify(filteredEvents)); // Update storage
    
        // Verify storage
        console.log('Updated LocalStorage:', JSON.parse(localStorage.getItem('events')));
    }
      
      // Add Event functionality using password modal
      document.getElementById('addEventBtn').addEventListener('click', function () {
        showPasswordModal(function (isAuthenticated) {
          if (isAuthenticated) {
            const eventInput = document.getElementById('eventInput');
            const eventTitle = eventInput.value;
            const eventTime = document.getElementById('eventTime').value;
      
            // Check if the selected date is in the past
            const selectedEventDate = new Date(selectedDate);
            const currentDateObj = new Date();
            currentDateObj.setHours(0, 0, 0, 0); // Set the current date to midnight to avoid time comparison issues
      
            if (selectedEventDate < currentDateObj) {
              // Close the modal immediately if the date is in the past
              document.getElementById('eventModal').style.display = 'none';
      
              // Show the alert
              alert("You cannot add an event to a past date!");
              return; // Prevent further code execution if the date is in the past
            }
      
            // Continue with the event adding logic if the date is valid
            if (eventTitle && eventTime) {
              const events = JSON.parse(localStorage.getItem('events')) || [];
              const dailyEvents = events.filter((event) => event.date === selectedDate);
      
              if (dailyEvents.length < 3) {
                const newEvent = { date: selectedDate, title: eventTitle, time: eventTime };
                events.push(newEvent);
                localStorage.setItem('events', JSON.stringify(events));
                eventInput.value = '';
                document.getElementById('eventModal').style.display = 'none';
                displayEvents();
                generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
              } else {
                document.getElementById('errorMessage').style.display = 'block';
                setTimeout(() => {
                  document.getElementById('errorMessage').style.display = 'none';
                }, 3000);
              }
            }
          }
        });
      });
      
      window.onload = function () {
        cleanupPastEvents(); // Remove past events first
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
        displayEvents(); // Display events after cleanup
    };
      
      function cancelEvent(index) {
        showPasswordModal(function (isAuthenticated) {
          if (isAuthenticated) {
            const events = JSON.parse(localStorage.getItem('events')) || [];
            events.splice(index, 1);
            localStorage.setItem('events', JSON.stringify(events));
            displayEvents();
          }
        });
      }
      
      function displayEvents() {
      const eventList = document.getElementById('eventList');
      eventList.innerHTML = ''; // Clear previous list
      
      // Get events from localStorage
      const events = JSON.parse(localStorage.getItem('events')) || [];
      
      events.sort((a, b) => new Date(b.date) - new Date(a.date));

      if (events.length === 0) {
        eventList.innerHTML = `<p>No upcoming events.</p>`;
        return;
    }
      
      events.forEach((event, index) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
      
      const eventItem = document.createElement('li');
      
      // Create a container for the calendar icon, date, and time
      const iconDiv = document.createElement('div');
      iconDiv.classList.add('event-icon');
      iconDiv.innerHTML = `<img src="image/calender.png" alt="Event Icon" style="width: 55px; height: 55px;">`; // Add event icon here
      
      const dateTimeDiv = document.createElement('div');
      dateTimeDiv.classList.add('event-date-time');
      dateTimeDiv.innerText = formattedDate;
      
      // Create the arrow and title container
      const titleContainer = document.createElement('div');
      titleContainer.classList.add('event-title-container');
      
      // Create the arrow element
      const arrowDiv = document.createElement('div');
      arrowDiv.classList.add('event-arrow');
      arrowDiv.innerHTML = '<img class="event-arrow" src="image/arrow.png" alt="Arrow">'; // Right arrow symbol
      
      // Create the event title
      const eventTitleDiv = document.createElement('div');
      eventTitleDiv.classList.add('event-title');
      eventTitleDiv.innerText = event.title;
      
      // Append elements to the title container
      titleContainer.appendChild(arrowDiv);
      titleContainer.appendChild(eventTitleDiv);
      
      // Create a container for date, time, and title
      const dateTimeTitleContainer = document.createElement('div');
      dateTimeTitleContainer.style.display = 'flex'; // Flexbox to align items
      dateTimeTitleContainer.style.alignItems = 'center'; // Center align items vertically
      
      dateTimeTitleContainer.appendChild(iconDiv);
      dateTimeTitleContainer.appendChild(dateTimeDiv);
      dateTimeTitleContainer.appendChild(titleContainer);
      
      // Append elements to the event item
      eventItem.appendChild(dateTimeTitleContainer);

      eventItem.innerHTML = `
      <div class="event-con">
          <div class="event-list-title">
              <img class="event-icon "src="image/calender.png" alt="Event Icon">
              <div class="event-date-time">${formattedDate} - ${event.time}</div>
          </div>
          <div class="event-list-container">
              <img class="event-arrow" src="image/arrow.png" alt="Arrow">
              <div class="event-title">${event.title}</div>
          </div>
      </div>
    `;
      
      // Event cancellation functionality
      eventItem.addEventListener('click', () => {
          if (confirm('Are you sure you want to cancel this event?')) {
              cancelEvent(index);
          }
      });
      
      eventList.appendChild(eventItem);
      });
      }
      
      // Initialize
      generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
      displayEvents();
      