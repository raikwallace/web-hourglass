async function limitTime() {
    console.log("hello from limit-time.js")

    chrome.storage.sync.get("limitedDomains", (data) => {
        data.limitedDomains.forEach(url => {
            if (window.location.hostname.includes(url)) {
                window.location.assign("https://giphy.com/embed/l1KueCvasUHHQVI64");
            }

        })
    })

}

window.onload = (event) => {
    setInterval(() => {
        chrome.storage.sync.get("limitedDomains", (limitedDomains) => {
            if (!limitedDomains) {
                return;
            }
            limitedDomains.limitedDomains.forEach(url => {
                if (window.location.hostname.includes(url)) {
                    chrome.storage.sync.get("usedTimeSec", (data) => {
                        if (data.lastDay != new Date().getDate()) {
                            chrome.storage.sync.set({ usedTimeSec: 0, lastDay: new Date().getDate() })
                        }
                        chrome.storage.sync.set({ usedTimeSec: data.usedTimeSec + 5, lastDay: new Date().getDate() })
                        chrome.storage.sync.get("timeSec", (timeSec) => {
                            if (timeSec.timeSec != 0 && data.usedTimeSec + 5 > timeSec.timeSec) {
                                limitTime()
                            }
                        });
                    })
                }
            }
            )
        }
        )
    }, 5_000)
}

chrome.storage.sync.get("timeSec", (timeSec) => {
    chrome.storage.sync.get("usedTimeSec", (usedTimeSec) => {
        if (timeSec.timeSec == 0) {
            return;
        }
        if (usedTimeSec.usedTimeSec > timeSec.timeSec) {
            limitTime()
        }
    })
})

