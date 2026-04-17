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