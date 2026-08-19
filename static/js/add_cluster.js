document.addEventListener("DOMContentLoaded", function(){
    const addClusterNode = document.querySelector("#open-add-cluster");

    if(!addClusterNode){
        return;
    }

    addClusterNode.addEventListener("click", function(){
        if(!togglePanel("add-cluster-properties","add-cluster")){
            return;
        }

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