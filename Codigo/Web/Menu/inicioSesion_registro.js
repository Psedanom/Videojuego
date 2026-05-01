let player;

function register() {
    let mail = "@gmail.com";
    let pass = $("#password").val();
    let email = $("#username").val();
    if (email.toLowerCase().includes(mail)) {
        $.post("http://127.0.0.1:3000/register", {
            username: email,
            password: pass
        }).done(function (data) {
            if(data === "This email is already registered"){
                alert(data);
                return;
            }
            else if(data === "Password must be at least 8 characters long"){
                alert(data);
                return;
            }
            
            localStorage.setItem("player",JSON.stringify(data[0]));
            window.location.href = "registerUsername.html";
            alert("Register completed");
         
            

        });
    }
    else
        alert("El correo debe ser de gmail");

}
function login() {
    let mail = "@gmail.com";
    let pass = $("#password").val();
    let email = $("#username").val();
    if (email.toLowerCase().includes(mail)) {
        $.post("http://127.0.0.1:3000/login", {
            username: email,
            password: pass
        }).done(function (data) {
            console.log("posted");
            console.log(data);
            alert(`logged in succesfully for ${data[0].email}`);
            if (data.length != 0 && data != "Incorrect password or email") {
                player = data[0];
                localStorage.setItem("player",JSON.stringify(data[0]));    
                // localStorage.setItem("baseHealth", player.baseHealth);
                window.location.href = "index.html";
            }
        });
    }
    else
        alert("El correo debe ser de gmail");

}

function registerUsername() {

    let user = $("#username").val();
    console.log(user);
    let email = JSON.parse(localStorage.getItem("player"));

    $.post("http://127.0.0.1:3000/registerUsername", {
        username: user,
        mail: email
    }).done(function (data) {

        alert("Register completed");
        window.location.href = "inicioSesion_registro.html";

    });


}