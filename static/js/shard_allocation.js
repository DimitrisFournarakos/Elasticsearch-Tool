document.addEventListener("DOMContentLoaded",function(){
        const allocation =document.querySelector(".shard-allocation-item");

        if(!allocation){
            return;
        }

        allocation.addEventListener("click",function(e){
                e.stopPropagation();

                if(!togglePanel("shard-allocation-properties","shard-allocation")){
                    return;
                }

                document.getElementById("details-title").innerHTML ="📄 Shard Allocation";
                document.getElementById("allocation-started").textContent =this.dataset.started;
                document.getElementById("allocation-relocating").textContent =this.dataset.relocating;
                document.getElementById("allocation-initializing").textContent =this.dataset.initializing;
                document.getElementById("allocation-unassigned").textContent =this.dataset.unassigned;


                let status = "";
                if(
                    parseInt(this.dataset.unassigned) > 0
                ){
                    status ="🔴 Critical";
                }
                else if(
                    parseInt(this.dataset.relocating) > 0
                ){
                    status = "🟡 Rebalancing";
                }
                else{
                    status = "🟢 Healthy";
                }
                
                document.getElementById("allocation-status").innerHTML = status;
            }
        );

    }
);