const initializeWhatsAppDialog = () => {
  const openButton = document.querySelector("[data-whatsapp-open]");
  const dialog = document.querySelector("[data-whatsapp-dialog]");

  if (!(openButton instanceof HTMLButtonElement) || !(dialog instanceof HTMLDialogElement)) {
    return;
  }

  openButton.addEventListener("click", () => {
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
};

initializeWhatsAppDialog();
