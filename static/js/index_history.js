let indexDocsChart = null;
let indexSizeChart = null;

async function loadIndexHistory(indexName,period = "24h"){
    const response = await fetch(`/index-history/${indexName}/?period=${period}`);
    const data = await response.json();
    const history = data.history;

    if(history.length === 0){
        history.push({documents:data.current_docs,size_bytes:data.current_size,size_display:data.current_size,timestamp:new Date().toISOString()});
    }

    
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
        document.getElementById("index-current-size").textContent = latest.size_display;
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

    history.slice().reverse().forEach((item,index) =>{
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

            let eventLabel = "➜ No Change";
            let eventColor = "#4fc3f7";
            let docsDiff = 0;
            let sizeDiff = 0;

            const originalIndex = history.length - 1 - index;
            if(originalIndex > 0){
                const previous = history[originalIndex - 1];

                docsDiff = item.documents - previous.documents;
                sizeDiff = item.size_bytes - previous.size_bytes;

                if(docsDiff > 0 || sizeDiff > 0){
                    eventLabel = "📈 Growth Detected";
                    eventColor = "#00ff88";
                }
                else if(docsDiff < 0 || sizeDiff < 0){
                    eventLabel = "📉 Decrease Detected";
                    eventColor = "#ffd700";
                }
            }

            //Helper for MB
            const sizeDiffMB = (sizeDiff / (1024 * 1024)).toFixed(2);

            //Size and Docs Prefix
            const sizePrefix = sizeDiff > 0 ? "+" : sizeDiff < 0 ? "-" : '<span class="index-event-sign-placeholder"></span>' ; 
            const docsPrefix = docsDiff > 0 ? "+" : docsDiff < 0 ? "-" : '<span class="index-event-sign-placeholder"></span>' ;

            
            //I create div class="event-row" in order to put recent event documents alignment one under the other(with css event-row,event-date,event-docs,event-size,event-status in dashboard.css)
            events.innerHTML += `<div class="index-event-row" >
                                    <span class="index-event-date">${date}</span>
                                    <span class="index-event-docs">${docsPrefix}${Math.abs(docsDiff)} Docs</span>
                                    <span class="index-event-size">${sizePrefix}${Math.abs(sizeDiffMB).toFixed(2)} MB</span>                                
                                    <span class="index-event-status" style="color:${eventColor};">${eventLabel}</span>
                                </div>`;
                            });

    const docsLabels = [];
    const docsValues = [];
    const storageLabels = [];
    const storageValues = [];

    history.forEach(item => {

        const label = new Date(item.timestamp).toLocaleString("en-EN",
                    {   day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

            docsLabels.push(label);
            docsValues.push(item.documents);
            storageLabels.push(label);
            storageValues.push(item.size_bytes);
    });

    const docsCtx = document.getElementById("indexDocsChart");
    //Document Growth Chart
    if(indexDocsChart){
        indexDocsChart.destroy();
    }

    indexDocsChart = new Chart(
        docsCtx,
        {
            type: "line",

            data:
            {
                labels: docsLabels,
                datasets: [{ label:"Documents", data:docsValues, borderColor:"#4CAF50", backgroundColor:"rgba(76,175,80,0.15)", tension: 0.3,fill: true }]
            },
            options:
            {
                responsive: true,
                maintainAspectRatio:false
            }
        }
    );


    //Storage Growth Chart
    const storageCtx = document.getElementById("indexSizeChart");
    if(indexSizeChart){
        indexSizeChart.destroy();
    
    }
        console.log("Storage Values:",storageValues);
        indexSizeChart = new Chart(
            storageCtx,
            {
                type: "line",

                data:
                {
                    labels: storageLabels,
                    datasets:[{ label:"Storage Size", data:storageValues, borderColor:"#2196F3", backgroundColor:"rgba(33,150,243,0.15)", tension: 0.3, fill: true }]
                },
                options:
                {
                    responsive: true,
                    maintainAspectRatio:false
                }
            }
        );
}


document.addEventListener("DOMContentLoaded",function (){
        document.querySelectorAll(".index-history-item").forEach(item =>{

            item.addEventListener("click",function (){
                    if(!togglePanel("index-history-properties", this.dataset.index)){
                        return;
                    }

                    const indexName = this.dataset.index;
                    const displayName = this.dataset.displayName;
                    window.currentClusterTotal = parseBytes(this.dataset.clusterTotal);

                    document.getElementById("details-title").innerHTML =`📊 ${displayName}`;
                    document.getElementById( "index-history-name").textContent = indexName;
                    loadIndexHistory(indexName);

                }
            );
        });
        
        const indexFilter = document.getElementById("index-period");
            if(indexFilter){
                indexFilter.addEventListener("change",function (){
                        const indexName = document.getElementById("index-history-name").textContent;
                        loadIndexHistory(indexName,this.value);
                    }
                );
            }

    
});


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