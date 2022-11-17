$("#btnlogin").click(function(){    
    $(".msglogin").css("visibility","hidden");

    axios.post('http://localhost:3099/login', {
        email: $("#txtemail").val(),
        password: $("#txtpass").val()
      })
      .then(function (result) {
        localStorage.setItem("__token__",result.data.data.token)
        window.location.href = 'index.html';
      })
      .catch(function (error) {
        $(".msglogin").css("visibility","visible");
        $(".msglogin").html(error.response.data.msg)       
    });
      
});