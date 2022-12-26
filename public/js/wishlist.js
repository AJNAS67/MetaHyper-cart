async function addToWishlist(prodId, prodName, user) {
  if (user) {
    const Toast = await Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1200,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    await Toast.fire({
      icon: "success",
      title: "Item  successfully Updated to wishlist",
    });

    try {
      const response = await axios({
        method: "post",
        url: `/addtoWishlist/${prodId}`,
        data: {
          name: prodName,
        },
      });
    } catch (error) {
      window.location = "/signin";
    }
  } else {
    window.location = "/signin";
    const Toast = await Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1200,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    await Toast.fire({
      icon: "success",
      title: "Please login ! before add project in to wishlist",
    });
  }
}
