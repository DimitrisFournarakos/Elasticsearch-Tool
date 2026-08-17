document.addEventListener("DOMContentLoaded",function (){
        const refreshBtn = document.getElementById("refresh-dashboard-btn");

        if(refreshBtn){
            refreshBtn.addEventListener("click",function (){
                    location.reload();
            });
        }

});