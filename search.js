const db = firebase.firestore();

function loadStates() {
  const state = document.getElementById("state");
  state.innerHTML = `
    <option value="">Select State</option>
    <option value="Punjab">Punjab</option>
    <option value="Haryana">Haryana</option>
  `;
}

function loadDistricts() {
  const district = document.getElementById("district");
  district.innerHTML = `
    <option value="">Select District</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Ludhiana">Ludhiana</option>
  `;
}

function searchLawyers() {
  const country = document.getElementById("country").value;
  const state = document.getElementById("state").value;
  const district = document.getElementById("district").value;

  if (!country || !state || !district) return;

  db.collection("lawyers")
    .where("Country", "==", country)
    .where("State", "==", state)
    .where("District", "==", district)
    .where("verified", "==", true)
    .where("active", "==", true)
    .get()
    .then(snapshot => {
      const list = document.getElementById("lawyer-list");
      list.innerHTML = "";

      if (snapshot.empty) {
        list.innerHTML = "<p>No lawyers found</p>";
        return;
      }

      snapshot.forEach(doc => {
        const l = doc.data();
        list.innerHTML += `
          <div style="border:1px solid #ccc; padding:10px; margin:10px;">
            <h3>${l.Name}</h3>
            <p>${l.Specialisation}</p>
            <p>Experience: ${l.Experience} years</p>
            <button>Request Consultation</button>
          </div>
        `;
      });
    });
}
