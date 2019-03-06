function isLocalhost() {
    return (["localhost", "127.0.0.1"].indexOf(window.location.hostname) >= 0);
}

if (!isLocalhost()) {
    if (window.location.protocol != "https:") window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}