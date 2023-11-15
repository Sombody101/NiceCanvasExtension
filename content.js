const DEBUG = true;

// Config variables
const theme_id = "FC_THEME_LINK_CSS";
const ui_id = "FC_UI_LINK_CSS";
//

// Classes

//

function getItem(key) {
    return localStorage.getItem(key);
}

function setItem(key, value) {
    localStorage.setItem(key, value);
}

function checkDefault(key, vDefault) {
    // Get the value in google.store
    // If there isn't one, set a default and return it
    // Otherwise, return the value from google.store

    let ret = getItem(key);

    if (ret === null) {
        setItem(key, vDefault);
        return vDefault;
    }

    return ret;
}

function rmid(id) {
    document.getElementById(id) && document.getElementById(id).remove();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Skip parsing if the message is empty
    if (message == null || message == "") return;

    let sMessage = message.split("\0");
    let success = false;

    switch (sMessage[0]) {
        case "dark_theme":
            setItem(user_theme, !getItem(user_theme));
            reloadResources();
            success = true;
            break;
    }

    if (!success) {
        console.error(`Unknown command '${sMessage[0]}'`);
    } else if (DEBUG) {
        console.log(`[command]: ${sMessage}`);
    }
});

user_theme = checkDefault("user_theme", true); // true => 'dark_mode'
user_ui = checkDefault("user_ui", true);
function reloadResources(startup = false, forceTarget = undefined) {
    if (!startup) {
        function prep(id) {
            const elm = document.getElementById(id);
            elm.id += "_OLD";
        }

        // "prepare" the link elements by renaming them (prevent ID conflicts when creating new links) 
        prep(theme_id);
        prep(ui_id);
    }

    const target = forceTarget || document.documentElement;

    if (user_theme) {
        // Import CSS for dark mode
        const themeLink = document.createElement("link");
        themeLink.rel = "stylesheet";
        themeLink.type = "text/css";
        themeLink.href = chrome.runtime.getURL("/css/dark-canvas.css");
        themeLink.id = theme_id;
        target.appendChild(themeLink);
    }

    if (user_ui) {
        // Import css for cleaner UI
        const uiLink = document.createElement("link");
        uiLink.rel = "stylesheet";
        uiLink.type = "text/css";
        uiLink.href = chrome.runtime.getURL("/css/ui.css");
        uiLink.id = ui_id;
        target.append(uiLink);
    }

    // Remove old links (Remove them after to prevent flashbanging the user)
    if (!startup) {
        rmid(theme_id + "_OLD");
        rmid(ui_id + "_OLD");
    }
}

reloadResources(true);

let timeoutId;

// Function to handle changes in the DOM
function handleMutations(mutationsList, observer) {
    // Set a timeout to execute injectCSS after 200ms
    for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
                // Check if the added node is a link element or a style element
                if (
                    (node.id &&
                        !node.id.startsWith("FC_") &&
                        node instanceof HTMLLinkElement &&
                        node.rel === "stylesheet") ||
                    (node instanceof HTMLStyleElement &&
                        node.type === "text/css")
                ) {
                    // A new CSS file or style element was added, reload your styles
                    clearTimeout(timeoutId);
                    console.log("starting timeout...");

                    timeoutId = setTimeout(() => {
                        console.log("reloading css");
                        reloadResources();
                    }, 50);
                } else if (node.id && node.id == "tool_content") {
                    reloadResources(false, node);
                }
            });
        }
    }
}

// Create a MutationObserver and attach it to the document
const observer = new MutationObserver(handleMutations);
const observerConfig = { childList: true, subtree: true };
observer.observe(document, observerConfig);

addEventListener("DOMContentLoaded", (event) => {
    // Load customization menu button
    const sideMenu = document.getElementById("menu");

    const newButton = document.createElement("li");
    newButton.id = "loadCMenu";
    newButton.classList = "menu-item ic-app-header__menu-list-item";
    newButton.innerHTML = `
<a id=global_nav_history_link role=button href=# class=ic-app-header__menu-list-link>
<div class=menu-item-icon-container aria-hidden=true>
<svg class="ic-icon-svg menu-item__icon svg-icon-history" xmlns=http://www.w3.org/2000/svg version=1.1 viewBox="0.00 0.00 300.00 300.00">
<g stroke-width=2.00 fill=none stroke-linecap=butt>
<path stroke=#111111 vector-effect=non-scaling-stroke d="
          M 152.00 1.63
          Q 151.41 1.77 151.39 3.00
          Q 151.12 20.93 151.52 45.74"/>
<path stroke=#333333 vector-effect=non-scaling-stroke d="
          M 151.83 56.41
          Q 150.54 70.36 151.92 83.93"/>
<path stroke=#333333 vector-effect=non-scaling-stroke d="
          M 151.92 217.20
          Q 150.72 230.95 151.81 244.91"/>
<path stroke=#111111 vector-effect=non-scaling-stroke d="
          M 151.58 255.53
          L 151.45 300.00"/>
<path stroke=#822f25 vector-effect=non-scaling-stroke d="
          M 149.01 298.94
          L 149.00 255.93"/>
<path stroke=#822f25 vector-effect=non-scaling-stroke d="
          M 148.98 244.51
          L 148.95 217.54"/>
<path stroke=#822f25 vector-effect=non-scaling-stroke d="
          M 148.98 83.73
          L 149.01 56.79"/>
<path stroke=#822f25 vector-effect=non-scaling-stroke d="
          M 149.00 45.45
          L 149.00 2.34"/>
</g>
<path fill=#212121 d="
          M 149.06 0.00
          L 152.01 0.00
          L 152.00 1.63
          Q 151.41 1.77 151.39 3.00
          Q 151.12 20.93 151.52 45.74
          Q 152.49 51.00 151.83 56.41
          Q 150.54 70.36 151.92 83.93
          L 151.92 217.20
          Q 150.72 230.95 151.81 244.91
          Q 152.46 250.16 151.58 255.53
          L 151.45 300.00
          L 149.19 300.00
          Q 148.89 299.32 149.01 298.94
          L 149.00 255.93
          L 148.98 244.51
          L 148.95 217.54
          L 148.98 83.73
          L 149.01 56.79
          L 149.00 45.45
          L 149.00 2.34
          L 149.06 0.00
          Z"/>
<path fill=#000000 d="
          M 152.00 1.63
          C 155.52 1.21 159.31 2.12 162.01 2.24
          C 170.58 2.65 178.73 4.15 187.14 5.63
          C 188.44 5.86 189.87 6.77 191.42 6.59
          A 1.77 1.77 0.0 0 1 193.23 9.07
          C 192.48 10.76 192.56 12.94 192.04 14.61
          Q 185.84 34.56 166.47 42.92
          Q 163.57 44.17 160.47 44.67
          C 159.77 44.78 159.25 45.36 158.72 45.40
          Q 155.75 45.58 151.52 45.74
          Q 151.12 20.93 151.39 3.00
          Q 151.41 1.77 152.00 1.63
          Z"/>
<path fill=#e23d29 d="
          M 149.00 2.34
          L 149.00 45.45
          C 126.69 43.67 111.65 30.13 107.53 8.30
          Q 107.42 7.74 107.97 7.60
          Q 128.09 2.46 149.00 2.34
          Z"/>
<path fill=#000000 d="
          M 281.14 80.32
          C 276.55 83.73 271.34 86.57 265.91 87.58
          C 264.83 87.78 264.17 88.31 263.07 88.42
          Q 255.86 89.11 248.67 88.54
          C 242.90 88.09 236.50 85.59 231.13 82.00
          Q 226.85 79.15 224.03 76.26
          Q 217.79 69.84 214.65 61.63
          Q 214.29 60.67 213.88 60.14
          Q 213.59 59.77 213.58 59.30
          C 213.54 57.52 212.69 56.26 212.53 54.54
          C 212.34 52.61 211.55 50.99 211.54 49.13
          C 211.50 42.51 211.78 35.53 214.59 29.38
          C 216.54 25.09 218.39 20.85 220.63 19.03
          A 1.22 1.22 0.0 0 1 222.04 18.93
          Q 257.89 40.67 279.78 75.28
          Q 280.92 77.09 281.59 78.69
          Q 282.00 79.68 281.14 80.32
          Z"/>
<path fill=#e23d29 d="
          M 77.52 74.27
          C 62.66 90.80 37.09 93.62 19.34 79.69
          Q 19.11 79.51 19.26 79.26
          Q 41.59 41.93 78.89 19.55
          Q 79.34 19.28 79.66 19.71
          C 92.00 36.16 91.42 58.81 77.52 74.27
          Z"/>
<path fill=#444444 d="
          M 151.83 56.41
          C 155.51 56.86 157.12 57.88 159.60 59.69
          Q 159.94 59.94 160.21 60.27
          C 162.36 63.02 164.12 65.93 164.46 69.78
          C 164.63 71.77 163.58 73.55 163.37 75.63
          Q 163.32 76.20 162.82 76.49
          Q 162.44 76.70 162.44 77.20
          Q 162.44 77.72 162.08 78.10
          L 158.16 82.10
          Q 157.81 82.46 157.30 82.44
          Q 156.82 82.42 156.57 82.82
          Q 156.28 83.28 155.74 83.36
          L 151.92 83.93
          Q 150.54 70.36 151.83 56.41
          Z"/>
<path fill=#e23d29 d="
          M 149.01 56.79
          L 148.98 83.73
          C 132.69 81.39 132.60 58.79 149.01 56.79
          Z"/>
<circle fill=#444444 cx=207.10 cy=93.48 r=14.05 />
<circle fill=#e23d29 cx=93.49 cy=93.63 r=13.50 />
<path fill=#000000 d="
          M 270.50 183.47
          C 264.44 178.54 257.76 169.13 256.60 161.28
          C 256.41 160.01 255.71 159.37 255.62 158.19
          Q 255.05 150.88 255.52 143.56
          C 255.64 141.78 256.62 140.57 256.56 138.60
          Q 256.55 138.09 256.86 137.68
          C 257.63 136.67 257.43 135.78 257.89 134.80
          Q 260.94 128.35 261.99 126.72
          Q 267.45 118.22 276.96 112.53
          C 280.52 110.40 284.57 109.21 288.63 107.92
          C 290.17 107.43 291.70 107.49 293.34 107.30
          A 1.03 1.03 0.0 0 1 294.47 108.50
          Q 294.15 110.36 295.21 111.79
          Q 295.54 112.24 295.47 112.79
          Q 295.23 114.93 296.22 116.80
          Q 296.48 117.28 296.46 117.82
          C 296.37 120.40 297.25 122.68 297.46 125.21
          C 297.63 127.40 298.49 129.13 298.44 131.30
          C 298.35 135.73 299.45 140.24 299.45 144.25
          Q 299.44 151.58 299.45 158.91
          C 299.45 159.83 298.97 160.47 298.89 161.18
          Q 298.57 164.07 298.43 169.10
          C 298.38 171.13 297.60 173.11 297.49 175.25
          C 297.34 178.05 296.32 180.41 296.47 183.25
          Q 296.50 183.81 296.18 184.27
          Q 295.31 185.55 295.47 187.13
          Q 295.52 187.66 295.26 188.14
          Q 294.43 189.69 294.46 191.44
          A 2.01 2.01 0.0 0 1 292.03 193.45
          Q 286.29 192.21 280.53 189.99
          Q 276.72 188.53 270.50 183.47
          Z"/>
<path fill=#e23d29 d="
          M 7.94 107.78
          C 39.19 112.61 55.94 146.89 37.99 174.16
          Q 27.88 189.52 8.14 192.90
          A 0.69 0.69 0.0 0 1 7.35 192.38
          Q -3.06 150.26 7.38 108.15
          Q 7.49 107.71 7.94 107.78
          Z"/>
<path fill=#444444 d="
          M 223.33 138.46
          A 16.96 16.47 -73.1 0 1 226.31 136.81
          Q 228.21 136.00 231.77 136.27
          C 242.19 137.07 248.57 149.05 242.68 157.91
          Q 240.64 160.99 237.30 162.94
          C 236.28 163.53 235.41 163.29 234.38 164.06
          Q 233.97 164.37 233.46 164.41
          Q 223.26 165.29 218.33 156.96
          C 217.69 155.89 216.54 152.09 216.60 150.73
          Q 216.92 142.90 223.33 138.46
          Z"/>
<circle fill=#e23d29 cx=70.12 cy=150.32 r=13.51 />
<path fill=#444444 d="
          M 195.56 199.27
          C 201.05 192.29 210.92 190.88 217.08 197.46
          Q 220.12 200.71 221.17 205.76
          Q 221.74 208.51 220.75 210.24
          C 220.31 211.01 220.56 212.22 220.05 213.21
          C 216.37 220.32 208.03 223.71 200.54 219.67
          C 193.74 216.00 191.63 208.84 194.33 201.53
          Q 194.37 201.42 194.54 200.45
          Q 194.63 199.93 195.09 199.67
          Q 195.36 199.52 195.56 199.27
          Z"/>
<circle fill=#e23d29 cx=93.41 cy=207.10 r=13.50 />
<path fill=#000000 d="
          M 234.62 273.64
          Q 226.08 279.78 222.54 281.52
          Q 220.68 282.43 219.78 280.85
          Q 219.16 279.78 219.11 279.70
          C 216.47 275.91 213.33 269.91 212.56 264.22
          C 211.98 259.98 210.88 255.51 211.57 252.24
          C 212.17 249.45 212.25 246.50 213.21 243.82
          C 213.65 242.60 213.42 241.65 214.01 240.48
          C 215.38 237.77 216.50 234.68 217.98 232.32
          Q 225.55 220.24 239.09 214.95
          C 242.04 213.80 244.22 212.79 247.63 212.48
          C 249.39 212.32 250.94 211.59 252.60 211.57
          C 256.77 211.53 260.57 211.88 264.66 212.75
          Q 273.00 214.51 280.52 219.96
          Q 282.45 221.35 281.26 223.24
          C 268.92 242.87 253.49 260.07 234.62 273.64
          Z"/>
<path fill=#e23d29 d="
          M 19.25 220.93
          Q 31.12 212.29 45.38 212.12
          C 80.45 211.71 101.35 252.78 79.54 281.04
          Q 79.24 281.43 78.82 281.18
          Q 41.50 258.77 19.16 221.40
          A 0.36 0.35 56.3 0 1 19.25 220.93
          Z"/>
<path fill=#444444 d="
          M 151.92 217.20
          Q 158.18 217.89 161.38 222.39
          C 162.87 224.49 164.68 228.75 164.44 231.93
          C 164.33 233.33 163.48 234.51 163.38 236.04
          Q 163.35 236.49 163.10 236.87
          Q 162.46 237.80 161.35 239.58
          Q 158.61 243.99 151.81 244.91
          Q 150.72 230.95 151.92 217.20
          Z"/>
<path fill=#e23d29 d="
          M 148.95 217.54
          L 148.98 244.51
          C 132.79 242.57 132.54 219.85 148.95 217.54
          Z"/>
<path fill=#000000 d="
          M 151.58 255.53
          C 170.64 255.43 186.04 268.69 191.87 286.05
          C 192.54 288.05 192.65 290.64 193.58 292.99
          A 1.08 1.08 0.0 0 1 192.49 294.47
          Q 190.68 294.33 189.20 295.22
          Q 188.73 295.50 188.19 295.45
          Q 186.56 295.30 185.20 296.19
          Q 184.74 296.49 184.19 296.46
          Q 182.24 296.36 180.42 296.82
          Q 178.60 297.29 176.48 297.44
          C 174.51 297.59 173.05 298.47 171.14 298.43
          Q 168.09 298.37 165.10 298.83
          Q 161.89 299.32 158.84 299.32
          Q 155.22 299.32 151.82 300.00
          Q 151.64 300.00 151.45 300.00
          L 151.58 255.53
          Z"/>
<path fill=#e23d29 d="
          M 149.00 255.93
          L 149.01 298.94
          Q 128.44 298.87 108.03 293.73
          A 0.60 0.59 11.5 0 1 107.58 293.06
          C 111.14 272.09 127.23 256.71 149.00 255.93
          Z"/>
</svg>
</div>
<div class=menu-item__text>
FC Settings
</div>
</a>`;

    sideMenu.appendChild(newButton);

    // Actual menu
    newButton.addEventListener("click", createMenu);
});

let menuActive = false;
async function createMenu() {
    const target = document.body;
    if (menuActive) {
        rmid("FC_MENU");
    } else
        try {
            const response = await fetch(
                chrome.runtime.getURL("/popup/popup.html")
            );
            let html = await response.text();
            html.replace(
                "/popup/popup.css",
                chrome.runtime.getURL("/popup/popup.css")
            ).replace(
                "/popup/popup.js",
                chrome.runtime.getURL("/popup/popup.js")
            );

            const wrapper = document.createElement("div");

            wrapper.id = "FC_MENU";
            wrapper.innerHTML = html;
            target.appendChild(wrapper);
        } catch (error) {
            console.error("Error loading HTML file:", error);
        }
    menuActive = !menuActive;

    rmid(theme_id); // Just to make transition smoother
    if (user_theme) {
        // Import CSS for dark mode
        const themeLink = document.createElement("link");
        themeLink.rel = "stylesheet";
        themeLink.type = "text/css";
        themeLink.href = chrome.runtime.getURL("/css/dark-canvas.css");
        themeLink.id = theme_id;
        document.body.appendChild(themeLink);
    }
}
