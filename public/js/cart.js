async function addTocart(prodId, prodName, ProdPrice) {
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
    title: "cart successfully Updated",
  });

  try {
    const response = await axios({
      method: "post",
      url: `/addtocart/${prodId}`,
      data: {
        name: prodName,
        price: Number.parseFloat(ProdPrice),
      },
    });

    console.log(response, "resaja");
    // if (response.status == 200) {
    //   console.log("working add to cart0000000000000000000000");

    //   await Swal.fire({
    //     position: "top-end",
    //     icon: "success",
    //     title: "this prouct is out of stock",
    //     showConfirmButton: false,
    //     timer: 1600,
    //   });
    // }
    // window.location.reload();
    // toastr.success('cart item quantity updated')
  } catch (err) {
    console.log(err, "err");

    window.location = "/signin";
  }
}
function changeQuantity(prodId, count) {
  console.log(prodId, "changeQuantity");
  $.ajax({
    url: "/change-product-quantity",
    data: {
      product: prodId,
      count: count,
    },
    method: "post",
    success: (response) => {
      alert(response);
    },
  });
}
