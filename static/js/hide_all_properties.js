//Κάθε φορά που πατάω κάποιον επόμενο φάκελο, κρύψε το panel του προηγούμενου.
//Την χρησιμοποιω στην παρακατω συνάρτηση μέσα για να βάλω και την λειτουργία που όταν κάνεις κλικ  2η φορά πάνω στο αρχείο να κρύβεται το δεξί panel.
window.hideAllProperties = function () {     
    document.getElementById("node-properties").style.display = "none";
    document.getElementById("user-properties").style.display = "none";
    document.getElementById("cluster-properties").style.display = "none";
    document.getElementById("cluster-health-properties").style.display = "none";
    document.getElementById("index-properties").style.display = "none";
    document.getElementById("shard-properties").style.display = "none";
    document.getElementById("node-disk-properties").style.display = "none";
    document.getElementById("cluster-monitoring-properties").style.display = "none";
    document.getElementById("index-disk-properties").style.display = "none";
    document.getElementById("shard-storage-properties").style.display = "none";
    document.getElementById("shard-allocation-properties").style.display = "none";
    document.getElementById("snapshot-properties").style.display = "none";
};

//Συνάρτηση για να ανοιγει-κλείνει με click ένα αρχείο στο δεξί πάνελ.
window.togglePanel = function(panelId, itemId){
    const panel = document.getElementById(panelId);

    if (window.activeItem === itemId && panel.style.display === "block"){
        panel.style.display = "none";
        document.getElementById("details-title").innerHTML = "";
        window.activeItem = null;

        return false;
    }

    window.hideAllProperties();
    panel.style.display = "block";
    window.activeItem = itemId;

    return true;
};
