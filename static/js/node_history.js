document.addEventListener(
    "DOMContentLoaded",
    function ()
    {
        document
        .querySelectorAll(
            ".node-history-item"
        )
        .forEach(item =>
        {
            item.addEventListener(
                "click",
                function ()
                {
                    togglePanel(
                        "node-history-properties",
                        this.dataset.node
                    );

                    document.getElementById(
                        "details-title"
                    ).innerHTML =
                        "📊 Node History";

                    document.getElementById(
                        "node-history-name"
                    ).textContent =
                        this.dataset.node;
                }
            );
        });
    }
);