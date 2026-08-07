document.addEventListener("DOMContentLoaded", function () {

    const shards = document.querySelectorAll(".shard-item");
    shards.forEach(shard => {

        shard.addEventListener("click", function (e) {
            e.stopPropagation();
            if (!togglePanel("shard-properties",this.dataset.index + "-" + this.dataset.id +"-" + this.dataset.prirep)){
                return;
            }

            document.getElementById("details-title").innerHTML = "📄 shard-" + this.dataset.id;
            document.getElementById("shard-index").textContent = this.dataset.index;
            document.getElementById("shard-id").textContent = this.dataset.id;
            document.getElementById("shard-type").textContent = this.dataset.prirep === "p" ? "Primary" : "Replica";
            document.getElementById("shard-state").textContent = this.dataset.state;
            document.getElementById("shard-node").textContent = this.dataset.node;
            document.getElementById("shard-docs").textContent = this.dataset.docs;
            document.getElementById("shard-store").textContent = this.dataset.store;
            document.getElementById("shard-dataset").textContent = this.dataset.dataset;
            document.getElementById("shard-ip").textContent = this.dataset.ip;
        });

    });

});