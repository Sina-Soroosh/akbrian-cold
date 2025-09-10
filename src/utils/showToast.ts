import Swal from "sweetalert2";

const showToast = (title: string): void => {
  Swal.fire({
    title,
    position: "top",
    toast: true,
    customClass: {
      title: "text-2xl",
    },
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#360404",
    color: "#fff",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
};

export default showToast;
