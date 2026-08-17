document.addEventListener("DOMContentLoaded",function (){
        document.querySelectorAll(".shard-current-status-item").forEach(item =>{
            item.addEventListener("click",function (){

                    if(!togglePanel("shard-current-status-properties","shard-current")){
                        return;
                    }

                    document.getElementById("details-title").innerHTML = "📄 Shard Monitoring";
                    document.getElementById("shard-current-started").textContent = this.dataset.started;
                    document.getElementById("shard-current-relocating").textContent = this.dataset.relocating;
                    document.getElementById("shard-current-initializing").textContent = this.dataset.initializing;
                    document.getElementById("shard-current-unassigned").textContent = this.dataset.unassigned;

                    const started = parseInt(this.dataset.started);
                    const relocating = parseInt(this.dataset.relocating);
                    const initializing = parseInt(this.dataset.initializing);
                    const unassigned = parseInt(this.dataset.unassigned);

                    const healthElement = document.getElementById("shard-health-status");
                    if(unassigned > 0){
                        healthElement.innerHTML =`<span style="color:white;font-weight:bold;"> 🔴 Critical</span>`;
                    }
                    else if(initializing > 0 || relocating > 5){
                        healthElement.innerHTML =`<span style="color:white; font-weight:bold;"> 🟡 Warning</span>`;
                    }
                    else{
                        healthElement.innerHTML =`<span style=" color:white; font-weight:bold;"> 🟢 Healthy</span>`;
                    }

                    const allocationElement = document.getElementById("shard-allocation-status");
                    if(unassigned > 0){
                        allocationElement.innerHTML =`<span style=" color:white; font-weight:bold;"> ❌ Allocation Issues</span>`;
                    }else if(relocating > 0 || initializing > 0){
                        allocationElement.innerHTML =`<span style="color:white; font-weight:bold;"> ⚠ Rebalancing</span>`;
                    }else{
                        allocationElement.innerHTML =`<span style="color:white; font-weight:bold;"> ✅ Fully Allocated</span>`;
                    }

                    document.getElementById("shard-current-total").textContent = this.dataset.total;
                    document.getElementById("shard-current-primary").textContent = this.dataset.primary;
                    document.getElementById( "shard-current-replica").textContent = this.dataset.replica;
                    document.getElementById( "shard-current-storage").textContent = this.dataset.storage;

                }
            );

        });

    }
);