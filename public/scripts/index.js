function updateCounts() {
  fetch("/count")
    .then(res => res.json())
    .then(data => {
      const countEl = document.getElementById("outstanding-count");
      const link = document.getElementById("checkin-link");

      if (countEl) {
        if (data.outstanding > 0) {
          countEl.textContent = data.outstanding;
        } else {
          link.textContent = "Checkin";
        }
      }

      // If you also show count on checkout page
      const checkoutCountEl = document.getElementById("checkout-count");
      if (checkoutCountEl) {
        checkoutCountEl.textContent = data.outstanding;
      }
    })
    .catch(err => console.error("Failed to fetch count:", err));
}

setInterval(updateCounts, 1000);

updateCounts();
