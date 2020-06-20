import swal from 'sweetalert2';

const WESISHO = 'WeSiSho';

export const showErrorMessage = (message: string): void => {
    swal(WESISHO, message, 'error');
};

export const showSuccessMessage = (message: string): void => {
    swal(WESISHO, message, 'success');
};

export const showTimedMessage = (message: string, timeout = 2000): void => {
    swal({
        title: WESISHO,
        text: message,
        showConfirmButton: false,
        timer: timeout,
    });
};

export const showConfirmationMessage = (title: string, message: string, callback: () => void, confirmButtonText = 'Ok'): void => {
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

export const getBaseUrl = (url: string): string => {
    const regexp = /https?:\/\/([^/#]+)/gi;
    const groups = regexp.exec(url);

    if (groups && groups[1]) {
        return groups[1].toLowerCase();
    }

    // TODO or raise exception
    return '';
};
