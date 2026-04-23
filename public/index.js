window.onload = loadExperiences; //när sidan laddas in körs loadexperiences


async function loadExperiences() {
    const res = await fetch('http://localhost:5000/workexperience');
    const data = await res.json();
    //hämta från servern
    const container = document.getElementById('list');
    container.innerHTML = '';

    data.forEach(exp => { //för varje id alltså arbete (experience) i databasen skapas en 
        const div = document.createElement('div');
        div.className = 'experience';
        div.innerHTML = `
    <h3>${exp.jobtitle} - ${exp.companyname}</h3>
    <p><strong>Plats:</strong> ${exp.location}</p>
    <p><strong>Period:</strong> ${exp.startdate} - ${exp.enddate}</p>
    <p>${exp.description}</p>
    <button class="delete-btn" onclick="deleteExperience(${exp.id})">Ta bort</button>
    <button class="edit-btn" onclick="openEditForm(${exp.id}, '${exp.companyname}', '${exp.jobtitle}', '${exp.location}', '${exp.startdate}', '${exp.enddate}', '${exp.description}')">Redigera</button>
`;
        container.appendChild(div);
    });
}

async function deleteExperience(id) {
    if (confirm("Är du säker på att du vill ta bort?")) {
        await fetch(`http://localhost:5000/workexperience/${id}`, { method: 'DELETE' });
        loadExperiences(); // refresh list
    }
} //ta bort ett arbete, alltså experiencet




const form = document.getElementById('form');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {// när användaren klickar submit kommer vi köra arrowfunctionen
    e.preventDefault();
    message.textContent = '';

    const companyname = document.getElementById('companyname').value; // hämtar alla inputfälts värden. 
    const jobtitle = document.getElementById('jobtitle').value;
    const location = document.getElementById('location').value;
    const startdate = document.getElementById('startdate').value;
    const enddate = document.getElementById('enddate').value;
    const description = document.getElementById('description').value;

    //om det saknas något får man ett meddelande 
    if (!companyname || !jobtitle || !location || !startdate || !description) {
        message.textContent = "Fyll i alla fält!";
        return;
    }
    if (enddate && startdate > enddate) { //om slutdatum är före startdatum får man också ett meddelande
        message.textContent = "Startdatum får inte vara efter slutdatum!";
        return;
    }
    //
    // skickar datan till server med post
    try {
        const res = await fetch('http://localhost:5000/workexperience', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyname, jobtitle, location, startdate, enddate, description })
        }); //konverterar till json och skickar iväg

        if (res.ok) { //om det funkade får man en alert. Vi resetar formen och stannar där om man vill fylla i mer
            alert("Erfarenhet sparad!");
            form.reset();
        } else { //annars får man felmeddelande 
            const error = await res.json();
            message.textContent = error.message;
        }
    } catch (err) {
        message.textContent = "Kunde inte nå servern";
    }
});



function openEditForm(id, companyname, jobtitle, location, startdate, enddate, description) {
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-companyname').value = companyname;
    document.getElementById('edit-jobtitle').value = jobtitle;
    document.getElementById('edit-location').value = location;
    document.getElementById('edit-startdate').value = startdate;
    document.getElementById('edit-enddate').value = enddate;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-form-container').style.display = 'block';
}

function closeEditForm() {
    document.getElementById('edit-form-container').style.display = 'none';
}

async function submitUpdate() {
    const id = document.getElementById('edit-id').value;
    const companyname = document.getElementById('edit-companyname').value;
    const jobtitle = document.getElementById('edit-jobtitle').value;
    const location = document.getElementById('edit-location').value;
    const startdate = document.getElementById('edit-startdate').value;
    const enddate = document.getElementById('edit-enddate').value;
    const description = document.getElementById('edit-description').value;

    if (enddate && startdate > enddate) {
        alert("Startdatum får inte vara efter slutdatum!");
        return;
    }

    const res = await fetch(`http://localhost:5000/workexperience/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyname, jobtitle, location, startdate, enddate, description })
    });

    if (res.ok) {
        closeEditForm();
        loadExperiences(); // uppdatera listan
    } else {
        const error = await res.json();
        alert(error.message);
    }
}