import Swal from "sweetalert2";

const Alert = () => {
  Swal.fire({
    text: "Chức năng update sau",
    icon: "info",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};

export default Alert;
