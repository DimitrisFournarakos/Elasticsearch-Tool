document.addEventListener("DOMContentLoaded", function () {

    const shards = document.querySelectorAll(".shard-item");
    shards.forEach(shard => {

        shard.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!togglePanel("shard-properties",this.dataset.index + "-" + this.dataset.id +"-" + this.dataset.prirep)){
                return;
            }

            document.getElementById("details-title").innerHTML = "📄 shard-" + this.dataset.id;
            document.getElementById("shard-index").innerHTML =`<span style="font-weight:bold;">${this.dataset.index}</span>`;
            document.getElementById("shard-id").textContent = this.dataset.id;
            
            //Type of Shard (Primary or Replica), Style
            const shardType = this.dataset.prirep;
            const shardTypeElement = document.getElementById("shard-type");
            if(shardType === "p"){
                shardTypeElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🔷 Primary</span>`;
            }
            else{
                shardTypeElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🔶 Replica</span>`;
            }

            //State of shard, Style
            const state = this.dataset.state.toLowerCase();
            const stateElement = document.getElementById("shard-state");

            if(state === "started"){
                stateElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🟢 Started</span>`;
            }
            else if(state === "initializing"){
                stateElement.innerHTML = `<span style=" color:white; font-weight:bold;"> 🟡 Initializing</span>`;
            }
            else if(state === "relocating"){
                stateElement.innerHTML = `<span style="color:white; font-weight:bold;"> 🔵 Relocating</span>`;
            }
            else if(state === "unassigned"){
                stateElement.innerHTML =`<span style=" color:white; font-weight:bold;"> 🔴 Unassigned</span>`;
            }
            else{
                stateElement.textContent = this.dataset.state;
            }
            
            document.getElementById("shard-node").textContent = this.dataset.node;
            document.getElementById("shard-docs").textContent = this.dataset.docs;
            document.getElementById("shard-store").textContent = this.dataset.store;
            document.getElementById("shard-dataset").textContent = this.dataset.dataset;
            document.getElementById("shard-ip").textContent = this.dataset.ip;
        });

    });

});