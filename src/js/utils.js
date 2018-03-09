import swal from 'sweetalert2';

const WESISHO = 'WeSiSho';

export const showErrorMessage = (message) => {
  swal(WESISHO, message, 'error');
};

export const showSuccessMessage = (message) => {
  swal(WESISHO, message, 'success');
};
