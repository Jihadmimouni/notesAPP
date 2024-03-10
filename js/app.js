window.onload = function () {
    Reminder.loadReminders();
    Note.loadNotes();
};

class Reminder {
    constructor(title, details, date, color) {
        this.title = title;
        this.details = details;
        this.date = date;
        this.color = color;
    }

    createReminder() {
        const reminder = document.createElement('div');
        reminder.classList.add('reminder');
        const formattedDetails = this.details.replace(/\n/g, '<br>');
        reminder.style.backgroundColor = this.color;
        const imgSrc = this.color !== "rgb(88, 65, 40)" ? "icons/brown-plus.png" : "icons/plus-circle.png";
        reminder.innerHTML = `
                <div class="reminderHeadline">
                    <img src="icons/icon%20_bell.png" alt="reminder"> 
                    <p>${this.title}</p>
                </div>
                <div class="details">
                    <div>
                        <p>${formattedDetails}</p>
                    </div>
                    <div class="menu">
                        <p class="dateToBeReminded">${this.date}</p>
                        <img class="removeReminder" src="${imgSrc}" alt="Remove Reminder"/>
                    </div> 
                </div>
        `;
        if (this.color === "rgb(88, 65, 40)") {
            reminder.classList.add('darkReminder');
        }

        // Get the reminders container
        const remindersContainer = document.querySelector('.reminders');

        if (document.querySelector('.no-reminders')) {
            remindersContainer.innerHTML = '';
        }

        // Append the new reminder
        remindersContainer.appendChild(reminder);
    }

    saveReminder() {
        // Get the existing reminders from localStorage
        let reminders = localStorage.getItem('reminders');

        // If reminders is null, initialize an empty array, else parse the JSON string to an array
        reminders = reminders ? JSON.parse(reminders) : [];

        // Add the new reminder to the array
        reminders.push(this);

        // Write the array back to localStorage
        localStorage.setItem('reminders', JSON.stringify(reminders));

    }

    static loadReminders() {
        // Get the existing reminders from localStorage
        let reminders = localStorage.getItem('reminders');

        // Get the reminders container
        const remindersContainer = document.querySelector('.reminders');

        // If reminders is not null, parse the JSON string to an array
        if (reminders) {
            reminders = JSON.parse(reminders);

            // If there are no reminders, display a message
            if (reminders.length === 0) {
                remindersContainer.innerHTML = '<p class="no-reminders" style="text-align: center; padding: 20px;">There are no reminders yet. Maybe add some?</p>';
            } else {
                // Create a new reminder for each item in the array
                reminders.forEach(reminderData => {
                    const reminder = new Reminder(reminderData.title, reminderData.details, reminderData.date, reminderData.color);
                    reminder.createReminder();
                });
            }
        } else {
            // If reminders is null, display a message
            remindersContainer.innerHTML = '<p class="no-reminders" style="text-align: center; padding: 20px;">There are no reminders yet. Maybe add some?</p>';
        }
    }

}

document.querySelector('.reminders').addEventListener('click', function (e) {
    if (e.target.classList.contains('removeReminder')) {
        // Get the title of the reminder to be removed
        const title = e.target.parentElement.parentElement.previousElementSibling.children[1].innerText;

        // Get the existing reminders from localStorage
        let reminders = localStorage.getItem('reminders');

        // If reminders is not null, parse the JSON string to an array
        if (reminders) {
            reminders = JSON.parse(reminders);

            // Filter the array to remove the reminder with the matching title
            reminders = reminders.filter(reminder => reminder.title !== title);

            // Write the array back to localStorage
            localStorage.setItem('reminders', JSON.stringify(reminders));
        }
        if (!document.querySelector('.reminder')) {
            const remindersContainer = document.querySelector('.reminders');
            remindersContainer.innerHTML = '<p class="no-reminders" style="text-align: center; padding: 20px;">There are no reminders yet. Maybe add some?</p>';
        }
        // Remove the reminder from the DOM
        e.target.parentElement.parentElement.parentElement.remove();
    }
});

document.querySelector('.addR').addEventListener('click', function (e) {
    e.preventDefault();

    const titleElement = document.getElementById('titleR');
    const detailsElement = document.getElementById('detailsR');
    const dateElement = document.getElementById('dateR');
    const colorElement = document.querySelector('.selectedColor');

    const title = titleElement.value.trim();
    const details = detailsElement.value.trim();
    const date = dateElement.value.trim();
    const color = window.getComputedStyle(colorElement).backgroundColor;

    if (!title) {
        highlightEmptyField(titleElement, 'Title is required', 'reminder');
    } else {
        titleElement.style.border = '';
    }

    if (!color) {
        colorElement.style.border = '2px solid red';
    } else {
        colorElement.style.border = '';
    }

    if (!title) {
        return;
    }

    const reminder = new Reminder(title, details, date, color);
    reminder.createReminder();
    reminder.saveReminder();
});

document.querySelector('.add-reminder').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('reminder-form').style.display = 'block';
});

function closeForm() {
    document.getElementById('reminder-form').style.display = 'none';
}


const overlay = document.getElementById('reminder-form');
overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
        closeForm();
    }
});


const circles = document.querySelectorAll('.Color-circle');
// Add a click event listener to each circle
circles.forEach(function (circle) {
    circle.addEventListener('click', function () {
        // Remove the focus border from all circles
        circles.forEach(function (c) {
            c.style.border = '4px solid white';
            c.classList.remove("selectedColor")
        });
        this.classList.add("selectedColor");
        this.style.border = '4px solid #FF8A00FF';
    });
});


const noteCircles = document.querySelectorAll('.note-form-container .Color-circle');
// Add a click event listener to each circle
noteCircles.forEach(function (circle) {
    circle.addEventListener('click', function () {
        // Remove the focus border from all circles
        noteCircles.forEach(function (c) {
            c.style.border = '4px solid white';
            c.classList.remove("selectedColor")
        });
        this.classList.add("selectedColor");
        this.style.border = '4px solid #FF8A00FF';
    });
});

document.querySelector('.add-note').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('note-form').style.display = 'block';
});

// Get the overlay and the close button
const noteOverlay = document.getElementById('note-form');
const closeButton = document.querySelector('.note-form-container .cancel');

// Add an event listener to the overlay
noteOverlay.addEventListener('click', function (e) {
    // If the target of the click event is the overlay, close the form
    if (e.target === noteOverlay) {
        noteOverlay.style.display = 'none';
    }
});

// Add an event listener to the close button
closeButton.addEventListener('click', function () {
    // Close the form
    noteOverlay.style.display = 'none';
});

class Note {
    constructor(title, details, date, flags, color) {
        this.title = title;
        this.details = details;
        this.date = date;
        this.flags = flags;
        this.color = color;
    }

    createNote() {
        // Create a new note element
        const note = document.createElement('div');
        note.classList.add('note');
        note.style.backgroundColor = this.color;
        const imgSrc = this.color !== "rgb(88, 65, 40)" ? "icons/settingsIcon.svg" : "icons/lightSettingsIcon.svg";

        // Set the innerHTML of the note
        note.innerHTML = `
            <div class="NoteHeader">
                <p class="noteTitle">${this.title}</p>
                <div class="settings-icon-container">
                     <img src="${imgSrc}" alt="settings">
                </div>
            </div>
            <p class="content">${this.details}</p>
            <div class="flags">
                ${this.flags.map(flag => `<div class="flag ${flag}">${flag}</div>`).join('')}
            </div>
        `;

        if (this.color === "rgb(88, 65, 40)") {
            note.classList.add('darkNote');
        }

        // Append the note to the note container
        const noteContainer = document.querySelector('.noteContainer');
        noteContainer.appendChild(note);
    }

    saveNote() {
        // Get the existing notes from localStorage
        let notes = localStorage.getItem('notes');

        // If notes is null, initialize an empty array, else parse the JSON string to an array
        notes = notes ? JSON.parse(notes) : [];

        // Add the new note to the array
        notes.push(this);

        // Write the array back to localStorage
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    static loadNotes() {
        // Get the existing notes from localStorage
        let notes = localStorage.getItem('notes');

        // Get the notes container
        const notesContainer = document.querySelector('.noteContainer');

        // If notes is not null, parse the JSON string to an array
        if (notes) {
            notes = JSON.parse(notes);

            // If there are no notes, display a message
            if (notes.length === 0) {
                notesContainer.innerHTML = '<p class="no-notes" style="text-align: center; padding: 20px;">There are no notes yet. Maybe add some?</p>';
            } else {
                // Create a new note for each item in the array
                notes.forEach(noteData => {
                    const note = new Note(noteData.title, noteData.details, noteData.date, noteData.flags, noteData.color);
                    note.createNote();
                });
            }
        } else {
            // If notes is null, display a message
            notesContainer.innerHTML = '<p class="no-notes" style="text-align: center; padding: 20px;">There are no notes yet. Maybe add some?</p>';
        }
    }
}

document.querySelector('.addN').addEventListener('click', function (e) {
    e.preventDefault();

    const titleElement = document.getElementById('titleN');
    const detailsElement = document.getElementById('detailsN');
    const dateElement = document.getElementById('dateN');
    const flags = Array.from(document.querySelectorAll('.note-form-container .flag:checked')).map(flag => flag.value);
    const colorElement = document.querySelector('.note-form-container .selectedColor');

    const title = titleElement.value.trim();
    const details = detailsElement.value.trim();
    const date = dateElement.value.trim();
    const color = window.getComputedStyle(colorElement).backgroundColor;

    if (!title) {
        highlightEmptyField(titleElement, 'Title is required', 'note');
        return;
    }

    const note = new Note(title, details, date, flags, color);
    note.createNote();
    note.saveNote();
});

function highlightEmptyField(element, errorMessage, type) {
    let errorElement;
    let formPopup;
    if (type === "reminder") {
        errorElement = document.getElementById("ErrorReminderAdd");
        formPopup = document.querySelector("#reminder-form .form-popup");
    } else {
        errorElement = document.getElementById("ErrorNoteAdd");
        formPopup = document.querySelector("#note-form .form-popup");
    }
    if (element.value.trim() === '') {
        element.style.border = '3px solid #ef754f';
        errorElement.innerHTML = errorMessage;
        formPopup.classList.add("jiggle");
        setTimeout(() => formPopup.classList.remove("jiggle"), 200);
    } else {
        element.style.border = '';
        errorElement.textContent = '';
    }
}

// Add a click event listener to the noteContainer
// document.querySelector('.noteContainer').addEventListener('click', function (e) {
//     // Find the closest ancestor of the clicked element (or the clicked element itself) which has the class settings-icon-container
//     const settingsIconContainer = e.target.closest('.settings-icon-container');
//     // If such an element exists
//     if (settingsIconContainer) {
//
//         // Create a new dropdown menu element
//         const dropdownMenu = document.createElement('div');
//         dropdownMenu.classList.add('dropdown-menu');
//
//         // Create the "Edit" and "Delete" options
//         const editOption = document.createElement('div');
//         editOption.classList.add('option');
//         editOption.innerText = 'Edit';
//         const deleteOption = document.createElement('div');
//         deleteOption.classList.add('option');
//         deleteOption.innerText = 'Delete';
//
//         // Append the options to the dropdown menu
//         dropdownMenu.appendChild(editOption);
//         dropdownMenu.appendChild(deleteOption);
//
//         // Append the dropdown menu to the note
//         settingsIconContainer.parentElement.appendChild(dropdownMenu);
//
//         // Add click event listeners to the options
//         editOption.addEventListener('click', function () {
//             // Call a function to edit the note
//             editNote(settingsIconContainer.parentElement);
//         });
//         deleteOption.addEventListener('click', function () {
//             // Call a function to delete the note
//             deleteNote(settingsIconContainer.parentElement);
//         });
//     }
// });
//
// document.addEventListener('click', function (e) {
//     // Get the dropdown menu
//     const dropdownMenu = document.querySelector('.dropdown-menu');
//
//     console.log('Clicked on the document'); // Add this line
//
//     // If the dropdown menu exists and the click event target is not inside the dropdown menu
//     if (dropdownMenu && !dropdownMenu.contains(e.target)) {
//         console.log('Clicked outside the dropdown menu'); // Add this line
//         // Hide the dropdown menu
//         dropdownMenu.style.display = 'none';
//     }
// });

