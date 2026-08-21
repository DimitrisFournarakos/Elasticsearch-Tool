document.addEventListener("DOMContentLoaded", function(){
    const addClusterNode = document.querySelector("#open-add-cluster");

    if(!addClusterNode){
        return;
    }

    addClusterNode.addEventListener("click", function(){
        if(!togglePanel("add-cluster-properties","add-cluster")){
            return;
        }
        
        resetAddClusterForm();

        document.getElementById("details-title").innerHTML = `<svg width="24"
                                                                height="23"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="2.5"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                style="vertical-align:middle; position:relative; top:-4px;">

                                                                <ellipse cx="10" cy="5" rx="6" ry="3"></ellipse>

                                                                <path d="M4 5v7c0 1.7 2.7 3 6 3s6-1.3 6-3V5"></path>

                                                                <path d="M20 10v8"></path>
                                                                <path d="M16 14h8"></path>

                                                            </svg> Add Cluster`;
    

    });

});

//Helper Function για να γίνεται reset το form του Add Cluster όταν πατάω κάπου αλλού
function resetAddClusterForm(){

    document.getElementById("form-cluster-url").value = "";
    document.getElementById("cluster-username").value = "";
    document.getElementById("cluster-password").value = "";

    document.getElementById("form-cluster-environment").selectedIndex = 0;

    document.getElementById("save-cluster-btn").disabled = true;

    document.getElementById("cluster-validation-result").innerHTML = "";

    document.getElementById("cluster-detected-info").style.display = "none";
    document.getElementById("cluster-detected-info").classList.remove("show");

    document.getElementById("cluster-validation-error").style.display = "none";
    document.getElementById("cluster-validation-error").classList.remove("show");

    document.getElementById("cluster-save-message").style.display = "none";
    document.getElementById("cluster-save-message").classList.remove("show");

    document.getElementById("detected-cluster-name").textContent = "";
    document.getElementById("detected-cluster-url").textContent = "";

}