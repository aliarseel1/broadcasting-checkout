window.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("outstanding-count");
  if (countEl) {
    let count = parseInt(countEl.textContent, 10) || 0;
    count = Math.max(0, count);

    if (count > 0) {
      countEl.textContent = count;
    } else {
      document.getElementById("checkin-link").textContent = "Checkin";
    }
  }

  if (document.querySelectorAll(".card").length === 0) {
    document.querySelector(".cards").innerHTML =
      "<p>No outstanding checkouts.</p>";
  }
});

document.querySelectorAll(".checkin-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const cardId = btn.dataset.id;

    if (!cardId) return console.error("No card ID found!");

    const result = await Swal.fire({
      title: "Are you sure you would like to checkin this equipment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, checkin!",
      background: "#1e1e1e",
      color: "#e0e0e0",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: "#888",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/checkin/${cardId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Successfully checked in equipment!",
          icon: "success",
          background: "#1e1e1e",
          color: "#e0e0e0",
          confirmButtonColor: "#4caf50",
          confirmButtonText: "OK",
        });

        btn.closest(".card").remove();

        const countEl = document.getElementById("outstanding-count");
        if (countEl) {
          let count = parseInt(countEl.textContent, 10) || 0;
          count = Math.max(0, count - 1);

          if (count > 0) {
            countEl.textContent = count;
          } else {
            document.getElementById("checkin-link").textContent = "Checkin";
          }
        }

        if (document.querySelectorAll(".card").length === 0) {
          document.querySelector(".cards").innerHTML =
            "<p>No outstanding checkouts.</p>";
        }

      } else {
        Swal.fire({
          title: "Error",
          text: "There was an issue checking in the equipment.",
          icon: "error",
          background: "#1e1e1e",
          color: "#e0e0e0",
          confirmButtonColor: "#4caf50",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error",
        text: "Could not connect to the server.",
        icon: "error",
        background: "#1e1e1e",
        color: "#e0e0e0",
        confirmButtonColor: "#4caf50",
      });
    }
  });
});