let indexDocsChart = null;
let indexSizeChart = null;

async function loadIndexHistory(indexName,period = "24h"){
    const response = await fetch(`/index-history/${indexName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;

    //Total Events
    document.getElementById("index-total-events").textContent = history.length;

    //Calculate Current Documents
    let latest = null;
    if(history.length > 0){
        latest = history[history.length - 1];
        document.getElementById("index-current-docs").textContent = latest.documents;
    }

    //Index Current Size
    let indexPercentage = 0;
    if(latest){
        document.getElementById("index-current-size").textContent = latest.size_bytes;
        indexPercentage = (latest.size_bytes / window.currentClusterTotal) * 100;
    }

    //Current Disk Status
    let diskStatus = "🟢 Healthy";
    if(indexPercentage >= 50)
    {
        diskStatus = "🔴 Critical";
    }
    else if(indexPercentage >= 20)
    {
        diskStatus = "🟡 Warning";
    }
    document.getElementById("index-current-status").textContent = diskStatus;

    //Documents Trend
    let docsTrend = "→ Stable";

    if(history.length >= 2){
        const previous = history[history.length - 2].documents;
        const current = history[history.length - 1].documents;

        if(current > previous){
            docsTrend = "↗ Increasing";
        }
        else if(current < previous)
        {
            docsTrend = "↘ Decreasing";
        }
    }
    document.getElementById("index-docs-trend").textContent = docsTrend;

    //Storage Trend
    let storageTrend = "→ Stable";
    if(history.length >= 2){
        const previous = history[history.length - 2].size_bytes;
        const current = history[history.length - 1].size_bytes;

        if(current > previous){
            storageTrend = "↗ Increasing";
        }
        else if(current < previous)
        {
            storageTrend = "↘ Decreasing";
        }
    }
    document.getElementById("index-size-trend").textContent = storageTrend;

    //Recent Events
    const events = document.getElementById("index-events");
    events.innerHTML = "";

    history.slice().reverse().forEach(item =>{
            const date = new Date(item.timestamp).toLocaleString("en-EN",
                    {   day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true
                    }
                );

            events.innerHTML += `<div style="margin-bottom:8px;">${date} - Docs: ${item.documents}</div>`;
        });

}


document.addEventListener("DOMContentLoaded",function (){
        document.querySelectorAll(".index-history-item").forEach(item =>{
            item.addEventListener("click",function (){
                    if(!togglePanel("index-history-properties", this.dataset.index)){
                        return;
                    }

                    const indexName = this.dataset.index;
                    window.currentClusterTotal = parseBytes(this.dataset.clusterTotal);

                    document.getElementById("details-title").innerHTML =`📊 ${indexName}`;
                    document.getElementById( "index-history-name").textContent = indexName;
                    loadIndexHistory(indexName);

                    const indexFilter = document.getElementById("index-period");

                    if(indexFilter){
                        indexFilter.addEventListener("change",function (){
                                const indexName = document.getElementById("index-history-name").textContent;

                                loadIndexHistory(indexName,this.value);
                            }
                        );
                    }
                }

            );
        });
    }
);


//Υπολογίζω το ποσοστό του index ως προς το cluster - Calculate the percentage of index regarding to the cluster.
function parseBytes(value){
    value = value.toUpperCase();

    if(value.endsWith("TB"))
        return parseFloat(value) * 1024 * 1024 * 1024 * 1024;

    if(value.endsWith("GB"))
        return parseFloat(value) * 1024 * 1024 * 1024;

    if(value.endsWith("MB"))
        return parseFloat(value) * 1024 * 1024;

    if(value.endsWith("KB"))
        return parseFloat(value) * 1024;

    if(value.endsWith("B"))
        return parseFloat(value);

    return 0;

}