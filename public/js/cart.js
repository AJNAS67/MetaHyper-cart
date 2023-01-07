async function addTocart(prodId, prodName, ProdPrice, applycoupen,prodQuantity,image) {
  if(prodQuantity<1){
    Swal.fire({
      title: 'Sweet!',
      text: `Sorry ${prodName} is out of stock`,
      imageUrl: '/images/productImages/'+image,
      imageWidth: 300,
      imageHeight: 400,
      imageAlt: 'Custom image',
    })
  }
  else{


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
          window.location = "/signin";
        }
      },
    });
  }
 
}
