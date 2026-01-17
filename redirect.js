function executeRedirect(source){
    const CONFIG = {
    REDIRECT_BASE: "https://127.0.0.1",
    WARNING_URL: "https://impsbl.hatenablog.jp/entry/20251231",
    WARNING_HASH: "#%E4%B8%8D%E5%AF%A9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%AEredirect%E5%85%88"
};

let destination_url;

switch (source) {
    case "umami":
    destination_url = CONFIG.WARNING_URL + CONFIG.WARNING_HASH;
    break;
    default:
    destinationUrl = CONFIG.REDIRECT_BASE;
}

window.location.replace(destination_url);
}