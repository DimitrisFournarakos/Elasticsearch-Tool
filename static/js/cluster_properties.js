document.addEventListener("DOMContentLoaded", function(){

    const clusters = document.querySelectorAll(".cluster-item");
    
    clusters.forEach(cluster => {
        cluster.addEventListener("click", function(){
            
            window.hideAllProperties();
            document.getElementById("cluster-properties").style.display = "block";
            document.getElementById("details-title").innerHTML =`🌐 ${this.dataset.name}`;
            document.getElementById("cluster-name").textContent =this.dataset.name;
            document.getElementById("cluster-url").textContent =this.dataset.url;
            document.getElementById("cluster-environment").textContent = this.dataset.environment;           

            document.getElementById("connect-btn").dataset.clusterId = this.dataset.id; //επιλέγω το cluster και αποθηκεύω το id του

        });


    });

});

//Συναρτηση click handler στο Connect Button
const connectBtn = document.getElementById("connect-btn");
    connectBtn.addEventListener("click", function(){

        const clusterId = this.dataset.clusterId;
        window.location.href = "/connect_cluster/" + clusterId + "/";
        
});

