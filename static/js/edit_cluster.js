document.addEventListener("DOMContentLoaded", function(){
    const editBtn = document.getElementById("edit-cluster-btn");

    if(!editBtn){
        return;
    }

    editBtn.addEventListener("click",function(){
            if(!togglePanel("add-cluster-properties","edit-cluster")){
                return;
            }

            resetAddClusterForm();

    document.getElementById("details-title").innerHTML = `<h3><svg width="20"
                                                                height="20"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                stroke-width="3"
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                style="vertical-align:middle; position:relative; top:-2px; margin-right:6px;">

                                                                <path d="M12 20h9"></path>
                                                                <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                                                            </svg>
                                                            Edit Cluster</h3>`;
                                                            
    document.querySelector("#add-cluster-properties h3").textContent = "Edit Cluster";
    document.getElementById("form-cluster-url").value = this.dataset.url;
    document.getElementById("form-cluster-environment").value = this.dataset.environment;
    document.getElementById("cluster-username").value = "";
    document.getElementById("cluster-password").value = "";
    document.getElementById("save-cluster-btn").textContent = "Save Changes";
    document.getElementById("save-cluster-btn").dataset.mode = "edit";
    document.getElementById("save-cluster-btn").dataset.clusterId = this.dataset.clusterId;
    document.getElementById("save-cluster-btn").disabled = true;
    document.getElementById("validate-cluster-btn").textContent = "Validate Changes";
    document.getElementById("save-cluster-btn").dataset.originalCluster = this.dataset.clusterName;


        });


});