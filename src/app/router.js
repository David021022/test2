export function activatePage(pageName) {
  const pageButtons = document.querySelectorAll("[data-page-btn]");
  const pages = document.querySelectorAll("[data-page]");

  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  pageButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.pageBtn === pageName);
  });
}

export function initRouter() {
  const pageButtons = document.querySelectorAll("[data-page-btn]");

  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activatePage(button.dataset.pageBtn);
    });
  });
}
