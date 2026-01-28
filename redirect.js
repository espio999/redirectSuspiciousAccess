/*function executeRedirect(source){
    const CONFIG = {
        REDIRECT_BASE: "https://0.0.0.0",
        WARNING_URL: "https://impsbl.hatenablog.jp/entry/20251231",
        WARNING_HASH: "#%E4%B8%8D%E5%AF%A9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%AEredirect%E5%85%88Redirect-Destination-for-Suspicious-Access"
    };

    let destination_url = CONFIG.REDIRECT_BASE;

    switch (source) {
        case "umami":
            destination_url = CONFIG.WARNING_URL + CONFIG.WARNING_HASH;
            break;
        default:
            destination_url = CONFIG.REDIRECT_BASE;
    }

    //console.log(destination_url);
    window.location.replace(destination_url);
}*/


function executeRedirect(source){
    const destination_url ="https://0.0.0.0";
    window.location.replace(destination_url);
}