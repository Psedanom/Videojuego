

function login() {

    console.log("caca culo pedo pis");
}

function register() {
    let mail = "@gmail.com";
    let pass = $("#password").val();
    let email = $("#username").val();
    if(email.toLowerCase().includes(mail)){
        $.post("http://127.0.0.1:3000/register", {
        username: email,
        password: pass
        }).done(function (data) {

            alert(data);

        });
    }
    else
        alert("El correo debe ser de gmail");

}
function login(){
    let mail = "@gmail.com";
    let pass = $("#password").val();
    let email = $("#username").val();
    if(email.toLowerCase().includes(mail)){
        $.post("http://127.0.0.1:3000/login", {
        username: email,
        password: pass
        }).done(function (data) {
            console.log("posted");
            console.log(data);
            alert(`logged in succesfully for ${data[0].email}`);
            if(data.length != 0 && data != "Incorrect password or email"){
                window.location.href = "../index.html";
            }
        });
        
    }
    else
        alert("El correo debe ser de gmail");

}