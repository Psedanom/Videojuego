function login() {

    console.log("caca culo pedo pis");
}

function register() {
    let pass = $("#password").val();
    let email = $("#username").val();

    
    $.post("http://127.0.0.1:3000/register", {
        username: email,
        password: pass
    }).done(function (data) {

        alert("Data Loaded: " + data);

    });
    

}
