document.addEventListener("DOMContentLoaded", function(){

    const searchInput = document.getElementById("cluster-search");

    if(!searchInput){
        return;
    }

    searchInput.addEventListener("input",function(){
            const search = this.value.toLowerCase();           
            let visibleClusters = 0;

            document.querySelectorAll(".cluster-item").forEach(cluster => {
                    const name = cluster.dataset.name.toLowerCase();
                    const visible = name.startsWith(search);

                    cluster.style.display = visible ? "" : "none";

                    if(visible){
                        visibleClusters++;
                    }

            });

            const noResults = document.getElementById("no-clusters-found");

            if(visibleClusters === 0){
                noResults.style.display = "block";
            }else{
                noResults.style.display = "none";

            }

    });

});