document.addEventListener("click", function(e){
    const cluster = e.target.closest(".cluster-item");
        if(!cluster){
            return;
        }

        if(!togglePanel("cluster-properties",cluster.dataset.id)){
            return;
        }

        const deleteConfirmation = document.getElementById("cluster-delete-confirmation");
        deleteConfirmation.classList.remove("show");
        deleteConfirmation.style.display = "none";

        document.getElementById("details-title").innerHTML = `🌐 ${cluster.dataset.name}`;
        document.getElementById("cluster-name").textContent = cluster.dataset.name;
        document.getElementById("cluster-url").textContent = cluster.dataset.url;
        document.getElementById("cluster-environment").textContent = cluster.dataset.environment;
        document.getElementById("connect-btn").dataset.clusterId = cluster.dataset.id;
        document.getElementById("delete-cluster-btn").dataset.clusterId = cluster.dataset.id;

        animatePanel("cluster-properties");
});

//Συναρτηση click handler στο Connect Button
const connectBtn = document.getElementById("connect-btn");
    connectBtn.addEventListener("click", function(){

        const clusterId = this.dataset.clusterId;
        window.location.href = "/connect_cluster/" + clusterId + "/";
        
});
