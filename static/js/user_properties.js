document.addEventListener("DOMContentLoaded", function () {

    const users = document.querySelectorAll(".user-item");

    users.forEach(user => {
        user.addEventListener("click", function (e) {
            e.stopPropagation();

            if (!togglePanel("user-properties",this.dataset.username)){
                return;
            }

            document.getElementById("details-title").innerHTML = "👤 " + this.dataset.username;
            document.getElementById("user-username").textContent = this.dataset.username;
            document.getElementById("user-fullname").textContent = this.dataset.fullname;
            document.getElementById("user-email").textContent = this.dataset.email;
            document.getElementById("user-role").textContent = this.dataset.role;
            document.getElementById("user-enabled").textContent = this.dataset.enabled;
            
        });

    });

});