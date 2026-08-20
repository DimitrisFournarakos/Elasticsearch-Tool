document.addEventListener("DOMContentLoaded",function(){
        const snapshots = document.querySelectorAll(".snapshot-item");

        snapshots.forEach(snapshot => { 
            snapshot.addEventListener("click",function(e){
                    e.stopPropagation();

                    if(!togglePanel("snapshot-properties",this.dataset.name)){
                        return;
                    }

                    document.getElementById("details-title").innerHTML = "📄 " + this.dataset.name;
                    document.getElementById("snapshot-name").innerHTML = this.dataset.name;
                    document.getElementById("snapshot-repository").textContent = this.dataset.repository;
                    document.getElementById("snapshot-state").textContent = this.dataset.state;
                    document.getElementById("snapshot-indices").innerHTML = this.dataset.indices;

                    animatePanel("snapshot-properties");
                }
            );

        });

    }
);