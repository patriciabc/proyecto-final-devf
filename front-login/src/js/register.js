$("#btnregistrar").click(function(){
  
    $(".msglogin").css("visibility","hidden");

    axios.post('http://localhost:3099/register', {
        name: $("#txtname").val(),
        lastName: $("#txtlastname").val(),
        email: $("#txtemail").val(),
        password: $("#txtpass").val()
      })
      .then(function (response) {
        $(".msglogin").css("visibility","visible");
        $(".msglogin").css("color","green");
        $(".msglogin").html("Su usuario fue creado con exito, ingrese a su correo para verificar su cuenta.")
        $(".input-group").css("display","none");
        $("#btnregistrar").css("display","none");
      })
      .catch(function (error) {
        $(".msglogin").css("visibility","visible");
        $(".msglogin").html(error.response.data.msg)       
    });
      
});