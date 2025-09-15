import Swal from "sweetalert2";

const showToast = (title: string): void => {
  Swal.fire({
    title,
    customClass: {
      title: "text-2xl",
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#360404",
    color: "#fff",
  });
};

export default showToast;
