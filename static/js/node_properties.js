document.addEventListener("DOMContentLoaded", function(){
    const nodes = document.querySelectorAll(".node-item");

    nodes.forEach(node => {
        node.addEventListener("click", function(e){
            e.stopPropagation();

            if (!togglePanel("node-properties",this.dataset.name)){
                return;
            }

            document.getElementById("details-title").innerHTML = this.dataset.icon + " " + this.dataset.name;
            document.getElementById("node-name").innerHTML = this.dataset.name;
            document.getElementById("node-host").textContent = this.dataset.host;
            document.getElementById("node-port").innerHTML = this.dataset.ports;
            document.getElementById("node-ip").textContent = this.dataset.ip;
            document.getElementById("node-version").textContent = this.dataset.version;

        });
    });
});