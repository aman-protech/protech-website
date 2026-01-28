const auth = firebase.auth();
const db = firebase.firestore();
let selectedLawyerId = null;

function searchLawyer() {
  const name = document.getElementById("searchName").value.trim();

  if (!name) {
    alert("Enter your name");
    return;
  }

  db.collection("lawyers")
    .where("Name", "==", name)
    .where("claimed", "==", false)
    .get()
    .then(snapshot => {
      const results = document.getElementById("results");
      results.innerHTML = "";

      if (snapshot.empty) {
        results.innerHTML = "<p>No unclaimed profile found</p>";
        return;
      }

      snapshot.forEach(doc => {
        const l = doc.data();
        results.innerHTML += `
          <div style="border:1px solid #ccc; padding:10px; margin:10px;">
            <b>${l.Name}</b><br>
            ${l.Specialisation}<br>
            ${l.BarCouncil || ""}
            <br>
            <button onclick="selectLawyer('${doc.id}')">
              This is me
            </button>
          </div>
        `;
      });
    });
}

function selectLawyer(id) {
  selectedLawyerId = id;
  document.getElementById("msg").innerText =
    "Profile selected. Enter enrolment number to confirm.";
}

function claimProfile() {
  const enrolment = document.getElementById("enrolment").value.trim();

  if (!selectedLawyerId || !enrolment) {
    alert("Select profile and enter enrolment number");
    return;
  }

  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "auth.html";
      return;
    }

    const ref = db.collection("lawyers").doc(selectedLawyerId);

    ref.get().then(doc => {
      if (doc.data().Enrollementnumber !== enrolment) {
        alert("Enrolment number does not match");
        return;
      }

      return ref.update({
        claimed: true,
        userId: user.uid,
        claimedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      document.getElementById("msg").innerText =
        "Profile claimed successfully. Await admin approval.";
    })
    .catch(err => alert(err.message));
  });
}
