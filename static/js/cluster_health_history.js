let clusterHealthChart = null;

async function loadClusterHealthHistory(clusterName,period = "24h")
{
    const response = await fetch(`/cluster-health-history/${clusterName}/?period=${period}`);
    const data = await response.json();

    document.getElementById("history-cluster-name").textContent = clusterName;
    document.getElementById("history-total-events").textContent = data.length;
    const currentStatus = data[data.length - 1].status;
    const icon = currentStatus === "green" ? "🟢" : currentStatus === "yellow" ? "🟡" : "🔴";

    document.getElementById("history-current-status").innerHTML = `${icon} ${currentStatus.toUpperCase()}`;
    

    if (!data || data.length === 0)
        {
            document.getElementById("history-cluster-name").textContent = clusterName;
            document.getElementById("health-events").innerHTML ="<div>No historical data available yet.</div>";
            return;
        }

    const labels = [];
    const values = [];

    data.forEach(entry =>{
        labels.push(entry.timestamp);

        if(entry.status === "green")
            values.push(3);

        else if(entry.status === "yellow")
            values.push(2);

        else
            values.push(1);
    });

    const ctx = document.getElementById("clusterHealthChart");
    if (clusterHealthChart) {
        clusterHealthChart.destroy();
    }

    clusterHealthChart = new Chart(ctx, {
        type: 'line',

        data:
        { 
            labels: labels,

            datasets:
            [{
                label: 'Cluster Health',
                data: values,
                borderColor: '#00ff88',
                tension: 0.3
            }]
        },
        options:
        {
            responsive: true,
            maintainAspectRatio: false,

            plugins:
            {
                legend:
                {

                    labels:{
                        color:"#ffffff"
                    }
                }
            },

            scales:
            {
                y:
                {
                    min: 1,
                    max: 3,

                     grid:
                        {
                            color: "#444"
                        },
                x:
                {
                    grid:
                    {
                        color: "#444"
                    },

                    ticks:
                    {
                        color: "#ffffff"
                    }
                },
                    ticks:
                    {
                        color: "#ffffff",

                        callback: function(value)
                        {
                            if(value === 3) return "GREEN";
                            if(value === 2) return "YELLOW";
                            if(value === 1) return "RED";
                        }
                    }
                }
            }
        }

    });

    const events = document.getElementById("health-events");

    events.innerHTML = "";
    data.slice().reverse().forEach(item =>
    {
            const color = item.status === "green" ? "#00ff88": item.status === "yellow" ? "#ffd700" : "#ff4d4d";

    events.innerHTML += `<div style="margin-bottom:6px;"> ${item.timestamp} - <span style="color:${color};font-weight:bold;"> ${item.status.toUpperCase()}</span></div>`;
    });
}

document.addEventListener("DOMContentLoaded", function ()
{
    const historyNode = document.querySelector(".cluster-health-history-item");

    if (!historyNode){
        return;
    }

    historyNode.addEventListener("click", async function (e){
        e.stopPropagation();

        if (!togglePanel("cluster-health-history-properties","history-" + this.dataset.cluster)){
            return;
        }

        document.getElementById("details-title").innerHTML = "📊 " + this.dataset.cluster;
        await loadClusterHealthHistory(this.dataset.cluster);

    });
    const filter = document.getElementById("history-period");

    if(filter)
    {
        filter.addEventListener("change",
            async function(){
                const clusterName = document.getElementById("history-cluster-name").textContent;
                await loadClusterHealthHistory(clusterName,this.value);
            }
        );
    }

});