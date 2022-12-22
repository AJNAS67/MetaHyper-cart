async function addTocart(prodId, prodName, ProdPrice, applycoupen) {
  $.ajax({
    url: `/addtocart/${prodId}`,
    data: {
      name: prodName,
      price: Number.parseFloat(ProdPrice),
      applycoupen: applycoupen,
    },

    method: "post",
    success: (response) => {
      if (response.cart) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Item added to cart",
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
        // let count = $("#cart-count").html();
        // count = parseInt(count) + 1;
        // $("#cart-count").html(count);
      } else if (response.exist) {
        Swal.fire({
          position: "center",
          title: `Sorry...! 
                Already added to Cart`,
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else if (response.login) {
        Swal.fire({
          position: "center",
          title: `Sorry...! 
                Please login`,
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
        window.location = "/signin";
      } else if (response.applyCoupon) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: `Coupon Applied! 
                
                Please remove the coupon in cart page`,
          customClass: "swal-wide",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        // window.location = "/user_login";
        window.location = "/signin";
      }
    },
  });

  // console.log(applycoupen,'applycoupenapplycoupen');
  // const Toast = await Swal.mixin({
  //   toast: true,
  //   position: "top-end",
  //   showConfirmButton: false,
  //   timer: 1200,
  //   timerProgressBar: true,
  //   didOpen: (toast) => {
  //     toast.addEventListener("mouseenter", Swal.stopTimer);
  //     toast.addEventListener("mouseleave", Swal.resumeTimer);
  //   },
  // });

  // await Toast.fire({
  //   icon: "success",
  //   title: "cart successfully Updated",
  // });

  // try {
  //   const response = await axios({
  //     method: "post",
  //     url: `/addtocart/${prodId}`,
  //     data: {
  //       name: prodName,
  //       price: Number.parseFloat(ProdPrice),
  //     },
  //   });

  //   console.log(response, "resaja");

  //   } catch (err) {
  //     console.log(err, "err");

  //     window.location = "/signin";
  //   }
  // }
  // function changeQuantity(prodId, count) {
  //   console.log(prodId, "changeQuantity");
  //   $.ajax({
  //     url: "/change-product-quantity",
  //     data: {
  //       product: prodId,
  //       count: count,
  //     },
  //     method: "post",
  //     success: (response) => {
  //       alert(response);
  //     },
  //   });
}
