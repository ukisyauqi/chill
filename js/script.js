function setCarousel(name, title, orientation, imageCount) {
  let images = "";
  for (let i = 1; i < imageCount; i++) {
    images += `<img class="image-item ${orientation}" src="assets/${name}/${i}.png" alt="img-${i}" />`;
  }

  document.querySelector("#carousels").innerHTML += `
    <section class="${name}">
      <h1>${title}</h1>
      <div class="container">
        <div class="slider-wrapper">
          <button id="prev-slide" class="slide-button material-symbols-rounded">
            <img src="assets/icon-left-arrow.svg" alt="" />
          </button>
          <ul class="image-list">
            ${images}
          </ul>
          <button id="next-slide" class="slide-button material-symbols-rounded">
            <img src="assets/icon-right-arrow.svg" alt="" />
          </button>
        </div>
        <div class="slider-scrollbar">
          <div class="scrollbar-track">
            <div class="scrollbar-thumb"></div>
          </div>
        </div>
      </div>
    </section>
  `;

  // fixed: event listener error jika elemen tidak ada (proses rendering), jadi kasih delay 
  setTimeout(() => {
    const imageList = document.querySelector(
      `.${name} .slider-wrapper .image-list`
    );
    const slideButtons = document.querySelectorAll(
      `.${name} .slider-wrapper .slide-button`
    );
    const sliderScrollbar = document.querySelector(
      `.${name} .container .slider-scrollbar`
    );
    const scrollbarThumb = sliderScrollbar.querySelector(
      `.${name} .scrollbar-thumb`
    );
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;

    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
      const startX = e.clientX;
      const thumbPosition = scrollbarThumb.offsetLeft;
      const maxThumbPosition =
        sliderScrollbar.getBoundingClientRect().width -
        scrollbarThumb.offsetWidth;

      // Update thumb position on mouse move
      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX;
        const newThumbPosition = thumbPosition + deltaX;

        // Ensure the scrollbar thumb stays within bounds
        const boundedPosition = Math.max(
          0,
          Math.min(maxThumbPosition, newThumbPosition)
        );
        const scrollPosition =
          (boundedPosition / maxThumbPosition) * maxScrollLeft;

        scrollbarThumb.style.left = `${boundedPosition}px`;
        imageList.scrollLeft = scrollPosition;
      };

      // Remove event listeners on mouse up
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      // Add event listeners for drag interaction
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    });

    // Slide images according to the slide button clicks
    slideButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.id === "prev-slide" ? -1 : 1;
        const scrollAmount = imageList.clientWidth * direction;
        imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
      });
    });

    // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
      slideButtons[0].style.display =
        imageList.scrollLeft <= 0 ? "none" : "flex";
      slideButtons[1].style.display =
        imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    };

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
      const scrollPosition = imageList.scrollLeft;
      const thumbPosition =
        (scrollPosition / maxScrollLeft) *
        (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
      scrollbarThumb.style.left = `${thumbPosition}px`;
    };

    // Call these two functions when image list scrolls
    imageList.addEventListener("scroll", () => {
      updateScrollThumbPosition();
      handleSlideButtons();
    });
  }, 1000);
}

window.onload = () => {
  setCarousel("melanjutkan-tonton", "Melanjutkan Tonton Film", "landscape", 14);
  setCarousel("top-rating","Top Rating Film dan Series Hari ini", "potrait", 11);
  setCarousel("film-trending", "Film Trending", "potrait", 13);
  setCarousel("rilis-baru", "Rilis Baru", "potrait", 14);
};


