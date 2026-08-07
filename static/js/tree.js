document.addEventListener("DOMContentLoaded", function () {
    const folders =document.querySelectorAll(".folder");

    folders.forEach(folder => { 
        const child = folder.querySelector(":scope > .child");

        if (child) {
            const arrow = document.createElement("span");

            arrow.className = "arrow";
            arrow.textContent = "▶";
            folder.prepend(arrow);
        }

        const folderLabel = folder.querySelector(":scope > .folder-label");
        
        if (folderLabel) {
            folderLabel.addEventListener("click", function (e) {
                e.stopPropagation();

                const arrow = folder.querySelector(":scope > .arrow");
                if (child.style.display === "block") {

                    child.style.display = "none";

                    if (arrow) {
                        arrow.textContent = "▶";
                    }

                    // Κλείσε όλους τους υποφακέλους
                    child.querySelectorAll(".child").forEach(nestedChild => {
                        nestedChild.style.display = "none";
                    });

                    // Επαναφορά όλων των βελών
                    child.querySelectorAll(".arrow").forEach(nestedArrow => {
                        nestedArrow.textContent = "▶";
                    });

                } else { 
                    child.style.display = "block";

                    if (arrow) {
                        arrow.textContent = "▼";
                    }

                }
                
            });
        }
    });

});