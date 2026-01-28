const auth = firebase.auth();
const db = firebase.firestore();

let lawyerDocId = null;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "auth.html";
    return;
  }

  db.collection("lawyers")
    .where("userId", "==", user.uid)
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        alert("No claimed profile found");
        return;
      }

      const doc = snapshot.docs[0];
      lawyerDocId = doc.id;
      const data = doc.data();

      document.getElementById("bio").value = data.bio || "";
      document.getElementById("experience").value = data.Experience || "";
      document.getElementById("specialisation").value = data.Specialisation || "";
      document.getElementById("highlights").value = data.highlights || "";
      document.getElementById("languages").value = data.languages || "";
    });
});

function saveProfile() {
  if (!lawyerDocId) return;

  db.collection("lawyers").doc(lawyerDocId).update({
    bio: document.getElementById("bio").value,
    Experience: Number(document.getElementById("experience").value),
    Specialisation: document.getElementById("specialisation").value,
    highlights: document.getElementById("highlights").value,
    languages: document.getElementById("languages").value,
    profileUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    verified: false,
    active: false
  })
  .then(() => {
    document.getElementById("msg").innerText =
      "Profile updated. Pending admin approval.";
  })
  .catch(err => alert(err.message));
}
