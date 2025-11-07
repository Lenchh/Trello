import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './style-toastr-success.css';

export function toastrSuccess(description: string, headString: string): void {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    showDuration: 1000,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
    toastClass: 'style-toast-success',
    closeHtml: '<button class="closebtn"><i class="bi bi-x"></i></button>',
  };

  toastr.success(description, headString);
}
