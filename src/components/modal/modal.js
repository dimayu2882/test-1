(function() {
  const backdrop = document.querySelector('#modal-backdrop');
  document.addEventListener('click', modalHandler);
  
  function modalHandler(e) {
    const modalBtnOpen = e.target.closest('.js-modal');
    if (modalBtnOpen) { // open btn click
      const modalSelector = modalBtnOpen.dataset.modal;
      showModal(document.querySelector(modalSelector));
    }
    
    const modalBtnClose = e.target.closest('.modal__close');
    if (modalBtnClose) { // close btn click
      e.preventDefault();
      hideModal(modalBtnClose.closest('.modal'));
    }
    
    if (e.target.matches('#modal-backdrop')) { // backdrop click
      hideModal(document.querySelector('.modal.show'));
    }
  }
  
  function showModal(modalElem) {
    modalElem.classList.add('show');
    backdrop.classList.remove('modal__backdrop--hidden');
  }
  
  function hideModal(modalElem) {
    modalElem.classList.remove('show');
    backdrop.classList.add('modal__backdrop--hidden');
  }
})();
