function executeRedirect(){
    const CONFIG = {
      REDIRECT_BASE: "https://0.0.0.0",
      WARNING_URL: "https://impsbl.hatenablog.jp/entry/20260129",
      WARNING_HASH: "#Redirect-Destination-for-Suspicious-Access%E4%B8%8D%E5%AF%A9%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%AE%E8%BB%A2%E9%80%81%E5%85%88",
      // 本来のページURLをパラメータとして付与
      ORIGINAL_URL: `?from=${encodeURIComponent(window.location.href)}`
    };

    let destination_url = CONFIG.REDIRECT_BASE;

    switch (window.FLAG_MAP.reason) {
        case "fetch":
            destination_url = CONFIG.WARNING_URL + CONFIG.ORIGINAL_URL + CONFIG.WARNING_HASH;
            break;
        default:
            destination_url = CONFIG.REDIRECT_BASE;
    }

    //console.log(destination_url);
    window.location.replace(destination_url);
}

/*
function executeRedirect(source){
    const destination_url ="https://0.0.0.0";
    window.location.replace(destination_url);
}
*/
