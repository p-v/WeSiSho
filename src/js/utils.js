import swal from 'sweetalert2';

const WESISHO = 'WeSiSho';

export const showErrorMessage = (message) => {
  swal(WESISHO, message, 'error');
};

export const showSuccessMessage = (message) => {
  swal(WESISHO, message, 'success');
};

export const showTimedMessage = (message, timeout = 2000) => {
  swal({
    title: WESISHO,
    text: message,
    showConfirmButton: false,
    timer: timeout,
  });
};

export const showConfirmationMessage = (title, message, callback, confirmButtonText = 'Ok') => {
  swal({
    title,
    text: message,
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
  }).then((result) => {
    if (result) {
      callback();
    }
  }).catch(swal.noop);
};

export const getBaseUrl = (url) => {
  const regexp = /https?:\/\/([^/#]+)/gi;
  return regexp.exec(url)[1].toLowerCase();
};
